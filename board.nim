import std/random
import std/sugar
import std/sysrand
import std/strutils
import std/os

import words
import consts

type
  Board* = object
    words: array[0..5, string]
    allchars: CharSet

proc makeGuess*(b: Board, idx: int, word: string): seq[Direction] =
  # horizontal first
  # note that like the solver we're not currently handling multiples
  for i, c in word:
    if c notin b.allchars:
      result.add(black)
      continue
    if b.words[idx][i] == c:
      result.add(green)
      continue
    var col = false
    var row = false
    for c2 in b.words[idx]:
      if c2 == c:
        row = true
        break
    if i mod 2 == 0:
      # full word column
      for colidx in 0..4:
        if b.words[i div 2 + 3][colidx] == c:
          col = true
          break
    else:
      # just crossing the other horizontal words
      for wordidx in 0..2:
        if b.words[wordidx][i] == c:
          col = true
          break
    if row and col:
      result.add(orange)
    elif row:
      result.add(yellow)
    elif col:
      result.add(red)
    else:
      result.add(white)
  # now vertical
  for i, c in word:
    if c notin b.allchars:
      result.add(black)
      continue
    if b.words[idx+3][i] == c:
      result.add(green)
      continue
    var col = false
    var row = false
    for c2 in b.words[idx+3]:
      if c2 == c:
        col = true
        break
    if i mod 2 == 0:
      # full word row
      for rowidx in 0..4:
        if b.words[i div 2][rowidx] == c:
          row = true
          break
    else:
      # just crossing the other vertical words
      for wordidx in 3..5:
        if b.words[wordidx][i] == c:
          row = true
          break
    if row and col:
      result.add(orange)
    elif row:
      result.add(yellow)
    elif col:
      result.add(red)
    else:
      result.add(white)

proc makeRng*(): Rand =
  var seeda: array[0..7, byte]
  discard urandom(seeda)
  # eww
  let seedi = (cast[ptr int64](addr(seeda)))[]
  result = initRand(seedi)

proc clearSquare(): seq[string] =
  result = collect:
    for i in 0..4:
      "_____"
  result[1][1] = '-'
  result[1][3] = '-'
  result[3][1] = '-'
  result[3][3] = '-'

proc makeCdf(freqs: openarray[float64]): seq[float64] =
  var run = 0.0
  result = collect:
    for i in freqs:
      run += i
      run

proc getLetter(rng: var Rand): char =
  # nim has a built-in biased sample
  const alpha = "abcdefghijklmnopqrstuvwxyz"
  const freqComp = [0.9577067638575312,1.0746365927540549,0.8786854983956703,0.8084794698629877,0.8390188199496024,1.1590562839472278,0.9311320841983661,1.183457086485723,1.1269629051295118,1.1320028005600073,1.708949996593992,0.6973677748609911,0.8720428238579014,0.7439210713921984,1.0846180632474443,1.0475066119739818,1.1332361249681335,0.5746733219008352,1.5103048878414413,0.6230510393297222,1.1861811752104383,1.0879121545985662,1.2381178688313341,1.1020098292327185,0.9740881291182837,1.0916585571443655]
  const cdf = makeCdf(freqComp)
  return rng.sample(alpha, cdf)

# special cases for the word list lengths
# rest are just binary powers
const primes = [67, 131, 257, 521, 1063, 2111, 2333, 4127, 8273, 10709, 12973]
const generators = [41, 67, 131, 257, 513, 1111, 1243, 2367, 4346, 5432, 6373]
iterator shuffled*[T](rng: var Rand, words: seq[T]): T =
  var m, a: int
  for i, p in primes:
    if p > len(words):
      m = p
      a = generators[i]
  if m == 0:
    # this is cheap, but it's easy to end up with something which isn't
    # a generator over the full group if this changes
    raise newException(ValueError, "someone needs to update the word list length")
  let c = rng.rand(0..m)
  var x = rng.rand(0..m)
  for i in 0..<m-1:
    if x < len(words):
      yield words[x]
    x = (a * x + c) mod m

proc findWords(rng: var Rand, clue: string): string =
  # we're not using pre-shuffled word lists like upstream
  for w in shuffled(rng, answersOrdered):
    var ok = true
    for i, c in clue:
      if c != '_' and c != w[i]:
        ok = false
        break
    if ok:
      return w
  return ""

proc makeSquare*(): array[0..5, string] =
  var rng = makeRng()
  var ok = false
  var wordsUsed: array[0..5, string]
  while not ok:
    var square = clearSquare()
    wordsUsed = ["","","","","",""]
    for rnX in countup(0, 4, 2):
      for rnY in countup(0, 4, 2):
        square[rnX][rnY] = getLetter(rng)
    var tryAgain = 0
    var x = 0
    while x < 5:
      var rndAnswerCol = findWords(rng, square[x][0] & '_' & square[x][2] & '_' & square[x][4])
      var rndAnswerRow = findWords(rng, square[0][x] & '_' & square[2][x] & '_' & square[4][x])
      if rndAnswerCol != "" and rndAnswerRow != "" and
        rndAnswerCol != rndAnswerRow and
        rndAnswerCol notin wordsUsed and rndAnswerRow notin wordsUsed:
        wordsUsed[x div 2] = rndAnswerCol
        wordsUsed[x div 2 + 3] = rndAnswerRow
        square[x] = rndAnswerCol
        for yt in countup(1, 3, 2):
          if x == 1 or x == 3:
            # ?? doesn't happen
            continue
          square[yt][x] = rndAnswerRow[yt]
        ok = true
        tryAgain = 0
      else:
        ok = false
        if tryAgain > 25:
          # I don't see how this can work as originally written
          # as it causes us to start searching with an empty square
          # break out of loop instead
          break
        else:
          if rndAnswerCol == "" and rndAnswerRow == "":
            square[x][x] = getLetter(rng)
          elif rndAnswerCol == "":
            let twoFour = rng.rand(1..2)*2
            let idx = min(4, x+twoFour)
            square[x][idx] = getLetter(rng)
          else:
            let twoFour = rng.rand(1..2)*2
            let idx = min(4, x+twoFour)
            square[idx][x] = getLetter(rng)
          tryAgain += 1
          x -= 2
      x += 2
  # if we got here we have a board
  if rng.rand(0..1) == 1:
    # flip board, not sure this is needed but upstream does it
    let tmp = wordsUsed
    wordsUsed[0..2] = tmp[3..5]
    wordsUsed[3..5] = tmp[0..2]
  return wordsUsed

proc boardFromWords*(words: array[0..5, string]): Board =
  var cset: CharSet
  for w in words:
    for c in w:
      cset.incl(c)
  return Board(words: words, allchars: cset)

proc generateBoard*(): Board =
  let words = makeSquare()
  return boardFromWords(words)

proc printBoard*(b: Board) =
  echo b.words[0]
  echo b.words[3][1], " ", b.words[4][1], " ", b.words[5][1]
  echo b.words[1]
  echo b.words[3][3], " ", b.words[4][3], " ", b.words[5][3]
  echo b.words[2]

proc loadBoard*(s: string): Board =
  let words = s.split()
  if len(words) != 6:
    raise newException(ValueError, "invalid words length " & $len(words))
  var wa: array[0..5, string]
  for i, w in words[0..5]:
    wa[i] = w
  return boardFromWords(wa)

proc loadTestBoards*(): seq[Board] =
  for fn in walkFiles("boards*.txt"):
    var o = open(fn, fmRead)
    defer: o.close()
    for line in o.lines:
      result.add(loadBoard(line))

when isMainModule:
  import std/rdstdin
  let b = generateBoard()
  b.printBoard
  for idx in 0..2:
    let input = readLineFromStdin("> ")
    echo b.makeGuess(idx, input)

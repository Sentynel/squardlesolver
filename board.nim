import std/random
import std/sugar
import std/sysrand

import words

type
  Board* = object
    words: array[0..5, string]

proc makeRng(): Rand =
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

iterator shuffled(rng: var Rand, words: seq[string]): string =
  if len(words) != 2315:
    # this is cheap, but it's easy to end up with something which isn't
    # a generator over the full group if this changes
    raise newException(ValueError, "someone needs to update the word list length")
  const m = 2333 # first prime above 2315
  const a = 1243 # just something which is a generator
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

proc makeSquare(): array[0..5, string] =
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
  return wordsUsed

proc generateBoard*(): Board =
  return Board(words: makeSquare())

proc printBoard*(b: Board) =
  echo b.words[0]
  echo b.words[3][1], " ", b.words[4][1], " ", b.words[5][1]
  echo b.words[1]
  echo b.words[3][3], " ", b.words[4][3], " ", b.words[5][3]
  echo b.words[2]

when isMainModule:
  let b = generateBoard()
  b.printBoard
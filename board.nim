import std/sets
import std/rdstdin
import std/strutils

import words

type
  Direction = enum
    white, yellow, red, orange, green, black
    # reminder that yellow is horizontal
  Info = object
    letter: char
    dir: Direction
    pos: (int, int)
  Board = object
    info: HashSet[Info]
    # words lists are horizontal top to bottom
    # then vertical left to right
    options: array[0..5, HashSet[string]]
    wordFixed: array[0..5, bool]
    unchecked: set[char]
    excluded: set[char]

proc initBoard(): Board =
  result = Board()
  result.unchecked = {'a'..'z'}
  result.excluded = {}
  for i in 0..5:
    result.options[i] = answers

proc totalOpts(b: Board): int =
  for opt in b.options:
    result += len(opt)

proc printBoard(b: Board) =
  for i, opts in b.options:
    if i < 3:
      echo "h", i+1
    else:
      echo "v", i-2
    var j = 0
    for w in opts:
      if j >= 10:
        write(stdout, "...(" & $len(opts) & ")")
        break
      write(stdout, w & ", ")
      j += 1
    echo()
  echo()

iterator wordsForCoords(pos: (int, int)): (int, int, bool, bool) =
  # this yields the word index, the character in the word, whether it's vertical,
  # and whether it's in the row/column or crossing
  # this does not give the actual position as a crossing position
  let (y, x) = pos
  if y mod 2 == 0:
    # on a horizontal word
    yield (y div 2, x, false, true)
  if x mod 2 == 0:
    # on a vertical word
    yield (3 + (x div 2), y, true, true)
  # now the crossing words
  for y2 in 0..2:
    if y2*2 != y:
      yield (y2, x, true, false)
  for x2 in 0..2:
    if x2*2 != x:
      yield (3+x2, y, false, false)

iterator coordsForWords(idx: int): (int, int) =
  # this gets coordinates for an input guess, i.e. both horizontal and vertical
  var start = idx*2
  # horizontal
  for i in 0..<5:
    yield (start, i)
  # vertical
  for i in 0..<5:
    yield (i, start)

iterator coordsForWord(idx: int): (int, int) =
  if idx < 3:
    # horizontal
    for i in 0..<5:
      yield (idx*2, i)
  else:
    for i in 0..<5:
      yield (i, (idx-3)*2)

proc filter(s: var HashSet[string], keep: proc (w: string): bool {.closure.}) =
  var rem: seq[string] = @[]
  for word in s:
    if not keep(word):
      rem.add(word)
  for word in rem:
    s.excl(word)

proc edgeFilter(b: Board) =
  #let start = b.totalOpts
  discard

proc addConstraint(b: var Board, pos: (int, int), guess: char, dir: Direction, outer: bool = true) =
  b.unchecked.excl(guess)
  let info = Info(letter: guess, dir: dir, pos: pos)
  let (y, x) = pos
  if dir == black:
    # special case global remove
    if guess in b.excluded:
      return
    b.excluded.incl(guess)
    for i in 0..<len(b.options):
      b.options[i].filter do (w: string) -> bool:
        guess notin w
  else:
    # want to remove words that don't match the constraint
    # want to do it quickly for both a) complete words and b) individual (excluded only for now)
    # letters
    if info in b.info:
      return
    b.info.incl(info)
    var verinc, horinc, verexc, horexc, thisinc, thisexc = false
    case dir
    of white:
      verexc = true
      horexc = true
      thisexc = true
    of green:
      thisinc = true
    of red:
      verinc = true
      thisexc = true
      horexc = true
    of yellow:
      horinc = true
      thisexc = true
      verexc = true
    of orange:
      horinc = true
      verinc = true
      thisexc = true
    of black: discard # already did this one
    for (wordidx, charidx, vert, fullword) in wordsForCoords(pos):
      if fullword:
        if thisinc:
          b.options[wordidx].filter do (w: string) -> bool:
            w[charidx] == guess
        if thisexc:
          b.options[wordidx].filter do (w: string) -> bool:
            w[charidx] != guess
        if verexc and vert:
          b.options[wordidx].filter do (w: string) -> bool:
            guess notin w
        if horexc and not vert:
          b.options[wordidx].filter do (w: string) -> bool:
            guess notin w
        if verinc and vert:
          b.options[wordidx].filter do (w: string) -> bool:
            guess in w
        if horinc and not vert:
          b.options[wordidx].filter do (w: string) -> bool:
            guess in w
      else:
        if verexc and vert:
          b.options[wordidx].filter do (w: string) -> bool:
            w[charidx] != guess
        if horexc and not vert:
          b.options[wordidx].filter do (w: string) -> bool:
            w[charidx] != guess
    # TODO add cross-constraints from other words
    # simplest: when a set size hits one, fix any non-green letters
    # but can also do this when all options match on a given letter
    # and then "must be one of" when they don't
  for i, wset in b.options:
    if len(wset) == 1 and not b.wordFixed[i]:
      var word: string
      for itm in wset:
        word = itm
      echo "fixing word ", i, " to ", word
      b.wordFixed[i] = true
      var ctr = 0
      for pos in coordsForWord(i):
        b.addConstraint(pos, word[ctr], green, false)
        ctr += 1
  if outer:
    # only want to run this step once even if we recurse above
    echo "before edgeFilter ", b.totalOpts
    b.edgeFilter()
    echo "after edgeFilter ", b.totalOpts

proc toDirection(x: char): Direction =
  case x
  of 'w':
    result = white
  of 'y':
    result = yellow
  of 'r':
    result = red
  of 'o':
    result = orange
  of 'g':
    result = green
  of 'b':
    result = black
  else:
    raise newException(ValueError, "invalid direction")

proc play() =
  var b = initBoard()
  var idx = 0
  echo "skip|done|five letters, five horizontal states, five vertical states"
  echo "states=w|y|r|o|g|b"
  echo "e.g. aargh wyrgb ogwyo"
  # TODO handle multiple-hit clues
  while true:
    echo "reading index ", idx
    let input = readLineFromStdin("> ")
    case input
    of "done":
      break
    of "skip":
      idx = (idx + 1) mod 3
      continue
    else:
      let s = input.split
      if s.len != 3:
        echo "invalid input, needs 3 parts"
        continue
      let word = s[0]
      let hor = s[1]
      let ver = s[2]
      let states = hor & ver
      if word.len != 5 or hor.len != 5 or ver.len != 5:
        echo "invalid input"
        continue
      for i in word:
        if i notin 'a'..'z':
          echo "invalid input"
          continue
      for i in states:
        if i notin "roywbg":
          echo "invalid input"
          continue
      var i = 0
      for coord in coordsForWords(idx):
        var guess: char
        if i >= 5:
          guess = word[i-5]
        else:
          guess = word[i]
        let state = states[i]
        let dir = state.toDirection
        b.addConstraint(coord, guess, dir)
        i += 1
    idx = (idx + 1) mod 3
    b.printBoard

play()

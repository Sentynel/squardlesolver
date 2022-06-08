import std/sets
import std/rdstdin
import std/strutils
import std/sugar

import words

type
  Direction = enum
    white, yellow, red, orange, green, black
    # reminder that yellow is horizontal
  Info = object
    letter: char
    dir: Direction
    pos: (int, int)
  Solver = object
    info: HashSet[Info]
    # words lists are horizontal top to bottom
    # then vertical left to right
    options: array[0..5, HashSet[string]]
    wordFixed: array[0..5, bool]
    unchecked: set[char]
    excluded: set[char]

proc initSolver(): Solver =
  result = Solver()
  result.unchecked = {'a'..'z'}
  result.excluded = {}
  for i in 0..5:
    result.options[i] = answers

proc totalOpts(b: Solver): int =
  for opt in b.options:
    result += len(opt)

proc printSolver(b: Solver) =
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

iterator corners(): (int, int, int, int) =
  for hword in 0..<3:
    for vword in 0..<3:
      yield (hword, vword+3, vword*2, hword*2)

proc filter(s: var HashSet[string], keep: proc (w: string): bool {.closure.}) =
  var rem: seq[string] = @[]
  for word in s:
    if not keep(word):
      rem.add(word)
  for word in rem:
    s.excl(word)

# forward declared for mutual recursion
proc addConstraint(b: var Solver, pos: (int, int), guess: char, dir: Direction, outer: bool = true)

proc checkForSingles(b: var Solver) =
  for i, wset in b.options:
    if len(wset) == 1 and not b.wordFixed[i]:
      var word: string
      for itm in wset:
        word = itm
      b.wordFixed[i] = true
      var ctr = 0
      for pos in coordsForWord(i):
        b.addConstraint(pos, word[ctr], green, false)
        ctr += 1

proc edgeFilter(b: var Solver) =
  let start = b.totalOpts
  for (hword, vword, hidx, vidx) in corners():
    var hset: set[char]
    for i in b.options[hword]:
      hset.incl(i[hidx])
    var vset: set[char]
    for i in b.options[vword]:
      vset.incl(i[vidx])
    let combine = hset * vset
    if len(hset) > len(combine):
      b.options[hword].filter do (w: string) -> bool:
        w[hidx] in combine
    if len(vset) > len(combine):
      b.options[vword].filter do (w: string) -> bool:
        w[vidx] in combine
  b.checkForSingles()
  let endc = b.totalOpts
  if endc < start:
    b.edgeFilter()

proc addConstraint(b: var Solver, pos: (int, int), guess: char, dir: Direction, outer: bool = true) =
  b.unchecked.excl(guess)
  let info = Info(letter: guess, dir: dir, pos: pos)
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
  if outer:
    # only want to run this step once even if we recurse above
    b.edgeFilter()

proc addState(b: var Solver, idx: int, word: string, dirs: seq[Direction]) =
  var i = 0
  for coord in coordsForWords(idx):
    let guess =
      if i >= 5:
        word[i-5]
      else:
        word[i]
    let dir = dirs[i]
    b.addConstraint(coord, guess, dir)
    i += 1

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
    raise newException(ValueError, "invalid direction " & x)

proc play() =
  var b = initSolver()
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
        echo "invalid input lengths"
        continue
      var ok = true
      for i in word:
        if i notin 'a'..'z':
          echo "invalid input ", word
          ok = false
      for i in states:
        if i notin "roywbg":
          echo "invalid input ", i, " in ", states
          ok = false
      if not ok:
        continue
      let dirs = collect:
        for i in states:
          i.toDirection
      b.addState(idx, word, dirs)
    idx = (idx + 1) mod 3
    b.printSolver

play()

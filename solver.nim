import std/sets
import std/times
import std/math

import words
import consts

type
  Info = object
    letter: char
    dir: Direction
    pos: (int, int)
  Solver* = object
    info: HashSet[Info]
    # words lists are horizontal top to bottom
    # then vertical left to right
    options: array[0..5, HashSet[string]]
    wordFixed: array[0..5, bool]
    unchecked: CharSet
    excluded: CharSet
    included: CharSet
    oddchecks: seq[Info]
    realStateCount*: int
    move: int

proc initSolver*(): Solver =
  result = Solver()
  result.unchecked = {'a'..'z'}
  result.excluded = {}
  for i in 0..5:
    result.options[i] = answers

proc totalOpts(b: Solver): int =
  for opt in b.options:
    result += len(opt)

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
  # yields horizontal word idx, vertical word idx, horizontal char idx, vertical char idx
  for hword in 0..<3:
    for vword in 0..<3:
      yield (hword, vword+3, vword*2, hword*2)

iterator allowedStates(b: Solver): array[0..5, string] =
  for h1 in b.options[0]:
    for v1 in b.options[3]:
      if h1[0] != v1[0]:
        continue
      for h2 in b.options[1]:
        if h2[0] != v1[2]:
          continue
        for v2 in b.options[4]:
          if v2[0] != h1[2]:
            continue
          if v2[2] != h2[2]:
            continue
          for h3 in b.options[2]:
            if h3[0] != v1[4]:
              continue
            if h3[2] != v2[4]:
              continue
            for v3 in b.options[5]:
              if v3[0] != h1[4]:
                continue
              if v3[2] != h2[4]:
                continue
              if v3[4] != h3[4]:
                continue
              let res = [h1, h2, h3, v1, v2, v3]
              var allchars: CharSet
              for w in res:
                for c in w:
                  allchars.incl(c)
              if len(b.included - allchars) > 0:
                continue
              var ok = true
              for info in b.oddchecks:
                ok = false
                let (y, x) = info.pos
                if y mod 2 == 1:
                  # horizontal, check vertical words
                  for widx in 3..5:
                    if (widx-3)*2 == x:
                      continue
                    if res[widx][y] == info.letter:
                      ok = true
                      break
                else:
                  # vertical, check horizontal words
                  for widx in 0..2:
                    if widx * 2 == y:
                      continue
                    if res[widx][x] == info.letter:
                      ok = true
                      break
                if not ok:
                  break
              if ok:
                yield res

proc filter(s: var HashSet[string], keep: proc (w: string): bool {.closure.}) =
  var rem: seq[string] = @[]
  for word in s:
    if not keep(word):
      rem.add(word)
  for word in rem:
    s.excl(word)

# forward declared for mutual recursion
proc addConstraint(b: var Solver, pos: (int, int), guess: char, dir: Direction) {.gcsafe.}

proc checkForSingles(b: var Solver) {.gcsafe.} =
  for i, wset in b.options:
    if len(wset) == 1 and not b.wordFixed[i]:
      var word: string
      for itm in wset:
        word = itm
      b.wordFixed[i] = true
      var ctr = 0
      for pos in coordsForWord(i):
        b.addConstraint(pos, word[ctr], green)
        ctr += 1

proc edgeFilter(b: var Solver) {.gcsafe.} =
  let start = b.totalOpts
  for (hword, vword, hidx, vidx) in corners():
    var hset: CharSet
    for i in b.options[hword]:
      hset.incl(i[hidx])
    var vset: CharSet
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
    # repeat until we're not eliminating any further states
    b.edgeFilter()

proc addConstraint(b: var Solver, pos: (int, int), guess: char, dir: Direction) {.gcsafe.} =
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
    return
  # want to remove words that don't match the constraint
  # want to do it quickly for both a) complete words and b) individual (excluded only for now)
  # letters
  if info in b.info:
    return
  let (y, x) = pos
  b.info.incl(info)
  b.included.incl(guess)
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
  if (horinc and y mod 2 == 1) or (verinc and x mod 2 == 1):
    # these are the off-word crossing positions
    b.oddchecks.add(info)
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

proc slowStateFilter*(b: var Solver) {.gcsafe.} =
  var count = 0
  let starttime = cpuTime()
  var optsWord: array[0..5, HashSet[string]]
  # I've decided that this isn't necessary because it's already effectively captured
  # in pruning the options array
  #var optsChar = array[0..5, array[0..5, set[char]]]
  for state in b.allowedStates:
    let t = cpuTime()
    if t - starttime > 10.0:
      echo "spent 10 seconds generating slow states, stopping"
      b.realStateCount = -count
      return
    count += 1
    for idx, word in state:
      optsWord[idx].incl(word)
      #[
      var ctr = 0
      for pos in coordsForWord(idx):
        let (y, x) = pos
        optsChar[y][x].incl(word[ctr])
        ctr += 1
        ]#
  b.options = optsWord
  b.checkForSingles()
  b.realStateCount = count

proc addState*(b: var Solver, idx: int, word: string, dirs: seq[Direction], fast: bool = false) {.gcsafe.} =
  var i = 0
  if len(word) != 5:
    raise newException(ValueError, "invalid word length " & word)
  for coord in coordsForWords(idx):
    if len(word) != 5:
      raise newException(ValueError, "invalid word length during iteration " & word & " " & $i)
    let guess =
      if i >= 5:
        word[i-5]
      else:
        word[i]
    let dir = dirs[i]
    b.addConstraint(coord, guess, dir)
    i += 1
  b.edgeFilter()
  if not fast:
    b.slowStateFilter()
  b.move += 1

proc statesUpperBound*(b: Solver): float64 =
  # return the logarithm because this gets big
  for w in b.options:
    result += ln(float64(len(w)))

proc estStates*(b: Solver): int =
  let ub = b.statesUpperBound
  if b.realStateCount > 0:
    # we've pruned unreachable states and can use a more accurate algorithm
    # though I'm not sure why we would, since we know the actual state count
    # at this point!
    result = int(pow(E, (ub - 3.25) / 2.5))
  else:
    # empirically derived, validity slightly questionable for large ub
    # also off a bit for small bounds, but that doesn't matter so much
    # in the middle this is a surprisingly accurate proxy though
    # log(ub) = 1.2 * log(states) + 16.8
    # TODO rerun the staterelate.nim test with bigger numbers, this is a bit sketch
    result = int(pow(E, (float64(ub) - 16.8) / 1.2))

# TODO improve these
const suggest2nd = ["glean","liart","grunt","golem","cools","poncy"]
proc suggest*(b: Solver): string =
  if b.move == 0:
    return "raise"
  if b.move == 1:
    for i in suggest2nd:
      var ok = true
      for c in i:
        if c in b.excluded:
          ok = false
          break
      if ok:
        return i
  return ""

when isMainModule:
  import std/rdstdin
  import std/strutils
  import std/sugar
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
    echo "log(state upper bound): ", b.statesUpperBound
    if b.realStateCount < 0:
      echo "total states at least: ", -b.realStateCount
    elif b.realStateCount > 0:
      echo "total states: ", b.realStateCount
    echo "estimated states: ", b.estStates
    echo()

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
      echo "suggested: ", b.suggest()
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

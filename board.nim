import std/sets
import std/rdstdin
import std/strutils

import words

type
  Direction = enum
    white, yellow, red, orange, green
    # don't bother with black, track separately
    # reminder that yellow is horizontal
  Info = object
    letter: char
    dir: Direction
  Board = object
    # just a 5x5 grid of the current state
    info: array[0..4, array[0..4, seq[Info]]]
    # words lists are horizontal top to bottom
    # then vertical left to right
    options: array[0..5, HashSet[string]]
    unchecked: set[char]
    excluded: set[char]

proc initBoard(): Board =
  result = Board()
  result.unchecked = {'a'..'z'}
  result.excluded = {}
  for i in 0..5:
    result.options[i] = answers

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
  else:
    raise newException(ValueError, "invalid direction")

iterator coordsForWords(idx: int): (int, int) =
  var start = idx*2
  # horizontal
  for i in 0..<5:
    yield (start, i)
  # vertical
  for i in 0..<5:
    yield (i, start)

proc play() =
  var b = initBoard()
  var idx = 0
  echo "skip|done|five letters, five horizontal states, five vertical states"
  echo "states=w|y|r|o|g|b"
  echo "e.g. aargh wyrgb ogwyo"
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
        # don't duplicate
        if (idx == 0 and i == 5) or
          (idx == 1 and i == 7) or
          (idx == 2 and i == 9):
          i += 1
          continue
        let y = coord[0]
        let x = coord[1]
        var guess: char
        if i >= 5:
          guess = word[i-5]
        else:
          guess = word[i]
        let state = states[i]
        b.unchecked.excl(guess)
        if state == 'b':
          b.excluded.incl(guess)
        else:
          let dir = state.toDirection
          let info = Info(letter: guess, dir: dir)
          (b.info[y][x]).add(info)
        i += 1
    idx = (idx + 1) mod 3

play()

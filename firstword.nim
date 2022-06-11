import std/threadpool
import std/random
{.experimental: "parallel".}

import board
import solver
import words

const firstWordChecks = 1000
type
  FirstWordResArray = array[0..firstWordChecks, float64]

proc reduceState(boards: seq[Board], word: string): FirstWordResArray {.gcsafe.} =
  echo "testing word ", word
  var ctr = 0
  var rng = makeRng()
  for board in shuffled(rng, boards):
    var solver = initSolver()
    let dirs = board.makeGuess(0, word)
    solver.addState(0, word, dirs, true) # fast check
    # log(upperbound)
    result[ctr] = solver.statesUpperBound
    if ctr >= firstWordChecks:
      break
    ctr += 1

# if you try and put this array on the stack you will run out of space
var results: array[0..len(allWords)-1,FirstWordResArray]
proc tryFirstWords() =
  let boards = loadTestBoards()
  parallel:
    for i in 0..<len(allWords):
      results[i] = spawn reduceState(boards, allWords[i])

  var f = open("firstword.csv", fmWrite)
  defer: f.close()
  for i, word in allWords:
    var line = word
    for j in results[i]:
      line &= "," & $j
    f.writeLine(line)

when isMainModule:
  tryFirstWords()

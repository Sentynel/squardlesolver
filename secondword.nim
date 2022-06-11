import std/threadpool
import std/random
{.experimental: "parallel".}

import board
import solver
import words

const secondWordChecks = 100
type
  SecondWordResArray = array[0..secondWordChecks, int]

proc reduceState(boards: seq[Board], word: string): SecondWordResArray {.gcsafe.} =
  echo "testing word ", word
  var ctr = 0
  var rng = makeRng()
  for board in shuffled(rng, boards):
    var solver = initSolver()
    let dirs = board.makeGuess(0, "raise")
    solver.addState(0, "raise", dirs, true) # fast check
    let dirs2 = board.makeGuess(1, word)
    solver.addState(1, word, dirs2, false) # slow check now as the state is ~small
    # log(upperbound)
    let res = solver.realStateCount
    if res <= 0:
      # hopefully this doesn't happen too often
      echo "using estimated state count"
      result[ctr] = solver.estStates
    else:
      result[ctr] = res
    if ctr >= secondWordChecks:
      break
    ctr += 1

# if you try and put this array on the stack you will run out of space
var results: array[0..len(allWords)-1,SecondWordResArray]
proc trySecondWords() =
  let boards = loadTestBoards()
  parallel:
    for i in 0..<len(allWords):
      results[i] = spawn reduceState(boards, allWords[i])

  var f = open("secondword.csv", fmWrite)
  defer: f.close()
  for i, word in allWords:
    var line = word
    for j in results[i]:
      line &= "," & $j
    f.writeLine(line)

when isMainModule:
  trySecondWords()

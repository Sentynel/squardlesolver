import std/threadpool
import std/random
{.experimental: "parallel".}

import board
import solver
import words

const wordsPerCheck = 30
const checks = 30
type
  ResArray = array[0..wordsPerCheck*2+1,int]

proc reduceStates(boards: seq[Board], word: string): ResArray {.gcsafe.} =
  # output is real state count, state upper bound for each test board
  echo "testing word ", word
  var ctr = 0
  var rng = makeRng()
  for board in shuffled(rng, boards):
    var solver = initSolver()
    let dirs = board.makeGuess(0, word)
    # do a fast check
    solver.addState(0, word, dirs, true)
    # get log(the state count)
    let ub = solver.statesUpperBound
    # then do a slow state check
    solver.slowStateFilter()
    result[ctr*2] = solver.realStateCount
    result[ctr*2+1] = ub
    if ctr >= wordsPerCheck:
      break
    ctr += 1

proc compareStateReductions() =
  let boards = loadTestBoards()
  #var results: array[0..len(allWords)-1,seq[int]]
  var results: array[0..checks,ResArray]
  var rng = makeRng()
  var words: array[0..checks,string]
  var i = 0
  echo "shuffling words"
  for w in shuffled(rng, allWords):
    words[i] = w
    i += 1
    if i > checks:
      break
  echo "done"

  parallel:
    for i in 0..checks:
      results[i] = spawn reduceStates(boards, words[i])

  var f = open("statereduction.csv", fmWrite)
  defer: f.close()
  for i, word in words:
    var line = word
    for j in results[i]:
      line &= "," & $j
    f.writeLine(line)

when isMainModule:
  compareStateReductions()

import std/threadpool
import std/random
import std/stats
import std/algorithm
{.experimental: "parallel".}

import board
import solver

const ngames = 1000

proc playGame(cnt: int, board: Board): int =
  echo cnt
  var solver = initSolver()
  var idx = 0
  #board.printBoard()
  while not solver.hasWon:
    let guess = solver.suggest()
    let dirs = board.makeGuess(idx, guess)
    #echo guess, " ", dirs
    discard solver.addState(idx, guess, dirs)
    idx = (idx + 1) mod 3
    if solver.move > 20:
      echo "failed to win, giving up"
      board.printBoard()
      return 9999
  #echo "won in ", solver.move
  return solver.move

# if you try and put this array on the stack you will run out of space
var results: array[0..ngames-1,int]
proc tryFirstWords() =
  let boards = loadTestBoards()
  var rng = makeRng()
  var i = 0
  var shufboards: array[0..ngames-1, Board]
  for board in shuffled(rng, boards):
    shufboards[i] = board
    i += 1
    if i >= ngames:
      break
  #let bconst = loadBoard("amass scrap elder aisle acrid super")
  parallel:
    for i in 0..<ngames:
      results[i] = spawn playGame(i, shufboards[i])
      #results[i] = spawn playGame(bconst)

  results.sort()
  var s: RunningStat
  s.push(results)
  echo "mean: ", s.mean
  echo "stdev: ", s.standardDeviation
  echo "median: ", results[len(results) div 2]
  echo "max: ", s.max
  echo "min: ", s.min

when isMainModule:
  tryFirstWords()

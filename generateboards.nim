import std/random
import std/strutils
import std/cpuinfo
import std/threadpool
{.experimental: "parallel".}

# run with:
# nim -d:release --threads:on r generateboards.nim

import board

proc makeBoards(n: int) =
  let fn = "boards" & $n & ".txt"
  echo "writing to ", fn
  var o = open(fn, fmAppend)
  defer: o.close()
  while true:
    let b = makeSquare()
    let op = b.join(" ")
    o.writeLine(op)
    o.flushFile()

randomize()
parallel:
  for i in 0..(countProcessors()-1):
    spawn makeBoards(rand(0..9999))

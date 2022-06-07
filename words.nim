import std/sets
import std/strutils

proc filterEmpty(a: seq[string]): seq[string] =
  for i in a:
    if len(i) == 5:
      result.add(i)

const answers* = staticRead("words.txt").split.filterEmpty.toHashSet

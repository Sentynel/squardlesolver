import std/sets
import std/strutils
import std/sequtils

const answers* = staticRead("words.txt").split.filter(proc (x: string): bool = len(x) == 5).toHashSet

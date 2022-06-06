import std/sets
import std/strutils

const answers* = staticRead("words.txt").split.toHashSet

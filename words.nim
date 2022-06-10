import std/sets
import std/strutils
import std/sequtils

const answersOrdered* = staticRead("words.txt").split.filter(proc (x: string): bool = len(x) == 5)
const answers* = answersOrdered.toHashSet
const allWords* = answersOrdered & staticRead("allowed_guesses.txt").split.filter(proc (x: string): bool = len(x) == 5)

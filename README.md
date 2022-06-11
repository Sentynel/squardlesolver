# Squardle solver

## Usage

You need nim installed to build: `curl https://nim-lang.org/choosenim/init.sh
-sSf | sh`

Run the interactive solver using `nim -d:release --mm:arc r solver.nim`. This
will suggest moves to you. Input your results as `guess horizontal_result
vertical_result`, where results are given as the string of colours you get,
identified by first letter (e.g. red green yellow black white = `rgybw`). Give
the overlapping character in both.

## Supporting tools

These should pretty much all be run with `nim -d:release --mm:arc --threads:on
r whatever.nim`. They mostly expect you've run `generateboards.nim` first to
build test boards.

`staterelate.nim`, `firstword.nim` and `secondword.nim` are statistics tools
used for validating the approach and choosing the first and second word
guesses. The corresponding `*.py` files process the output from these into
slightly more useful formats.

`testsolver.nim` runs the solver in its current form against a set of 1000
test boards and outputs some statistics about the results.

## Approach

### First word choice

Some testing reveals that estimating the number of states by multiplying the
number of options for each word is a decent enough proxy for the true number
of states a board can hold. Therefore, we test each word against a selection
of test boards and see which reduces the state count most on average. Values
below use the log of this value because it's huge.

The best scoring words are raise, salet, saice, and least. Other highly scoring
words are similar - you want to hit a bunch of the most common letters.

This is all done with a sample set of random boards - I'm not convinced that
the numbers are quite high enough, or the state count estimation quite accurate
enough, for this to be an inarguable result. (Or that the biggest state
reduction is actually the best first move, for that matter.)

Incidentally, the worst is "qaraq", with other bad options including xylyl,
immix, oxbow, pzazz and buzzy.

### Second word choice

The state space is still typically fairly large after the first word, making
testing every word against it slightly challenging. I assert that a "good"
choice of second word doesn't vary that much on the results of the first word,
with the obvious exception that in the event of one of the letters in the first
guess not showing up. Obviously there is some variation, but it's not huge.
The best results I have so far are: `["plant", "loden", "nould"]`

### Subsequent word choices

We're trying to balance a couple of competing requirements here:

1. Reduce the remaining state space.
2. Land green letters.

Once the state space is pinned down, optimising for landing green letters is
_relatively_ simple: prioritise the odd letters (as they can only be landed by
one input each, whereas the crossing ones get two chance), followed by any
letters.

Before that, balancing the two is difficult. In general the state collapses
pretty fast, and in many cases it'll hit 1 in the course of guessing a single
word anyway. The exceptions are largely cases like trope/trove where an odd-
placed uncommon consonant is difficult to reduce without just guessing it
individually.

Question: Is it better to just guess the best word out of the ones we know it
could be, or is there a case for testing the entire word space? When you have
two partials, finding a word which finishes both of them is better than
getting each one individually, but it's reasonably uncommon that that's
possible.

The current algorithm prioritises the average green squares, weighted at 2:1
for odd:even squares, followed by the average remaining state count. It does
not consider words which have a zero probability of landing a green for any
unknown letter; I don't know if this is sensible or not but it keeps the check
size manageable. Note that the average green squares is inverted so that
smallest values overall win. It makes sure to test the actual matching words
first if there's a lot of options to avoid silly misses.

Testing seems to validate this approach - results get a tiny bit worse with any
of the obvious changes - but we're talking a change of like 0.1 at most in the
mean.

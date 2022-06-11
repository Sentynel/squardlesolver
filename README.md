# Squardle solver

Very WIP.

## First word choice

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

## Second word choice

The state space is still typically fairly large after the first word, making
testing every word against it slightly challenging. I assert that a "good"
choice of second word doesn't vary that much on the results of the first word,
with the obvious exception that in the event of one of the letters in the first
guess not showing up. Obviously there is some variation, but it's not huge.
Right now I'm using this list, but this should change after a bigger stats run:
`["glean","liart","grunt","golem","cools","poncy"]`

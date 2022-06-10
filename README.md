# Squardle solver

Very WIP.

## First word choice

Some testing reveals that estimating the number of states by multiplying the
number of options for each word is a decent enough proxy for the true number
of states a board can hold. Therefore, we test each word against a selection
of test boards and see which reduces the state count most on average. Values
below use the log of this value because it's huge.

The best score is "carse": `carse av 25.2 +- 4.6 med 26 min 7 max 33`
"maist" and "reist" are both also good, and a bunch of other similar words -
a couple of common vowels and some common consonants. Interesting that "carse"
seems to beat "reist" despite c being relatively uncommon.

This is all done with a sample set of random boards - I'm not convinced that
the numbers are quite high enough, or the state count estimation quite accurate
enough, for this to be an inarguable result. (Or that the biggest state
reduction is actually the best first move, for that matter.)

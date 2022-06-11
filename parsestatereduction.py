#! /usr/bin/env python3
import math
import csv

full = []
partial = []
with open("statereduction.csv",newline="") as f:
    r = csv.reader(f)
    for row in r:
        word, *row = row
        for a,n in zip(row[::2], row[1::2]):
            b = math.e ** float(n)
            if int(a) < 0:
                m = math.log(-int(a))
                partial.append((str(-int(a)), b, str(m), str(n)))
            elif int(a) == 0:
                print("skipping", a, b)
            else:
                m = math.log(int(a))
                full.append((a,b,str(m),str(n)))

with open("statefull.csv","w") as f:
    f.write("real,upperbound,log(real),log(upperbound)\n")
    for a,b,c,d in full:
        f.write(f"{a},{b},{c},{d}\n")
with open("statepartial.csv","w") as f:
    f.write("partial,upperbound,log(partial),log(upperbound)\n")
    for a,b,c,d in partial:
        f.write(f"{a},{b},{c},{d}\n")

#! /usr/bin/env python3
import csv
import statistics

mins = {}
maxs = {}
avs = {}
stdevs = {}
medians = {}
with open("secondword.csv",newline="") as f:
    r = csv.reader(f)
    for row in r:
        word, *row = row
        row = [int(i) for i in row]
        mins[word] = min(row)
        maxs[word] = max(row)
        avs[word] = statistics.mean(row)
        medians[word] = statistics.median(row)
        stdevs[word] = statistics.stdev(row)


print("by mean:")
a = sorted(avs, key=lambda x: avs[x])[:100]
for i in a:
    print(f"{i} av {avs[i]} +- {stdevs[i]} med {medians[i]} min {mins[i]} max {maxs[i]}")

print("by median:")
a = sorted(avs, key=lambda x: medians[x])[:100]
for i in a:
    print(f"{i} av {avs[i]} +- {stdevs[i]} med {medians[i]} min {mins[i]} max {maxs[i]}")

i = "trial"
print(f"{i} av {avs[i]} +- {stdevs[i]} med {medians[i]} min {mins[i]} max {maxs[i]}")

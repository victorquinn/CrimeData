#!/usr/bin/python

import timeit
total_time = timeit.timeit("import urllib; urllib.urlretrieve('http://localhost:5000/crimes/2012', 'crimedata.json')", number=100)
print total_time
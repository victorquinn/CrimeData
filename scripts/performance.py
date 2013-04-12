#!/usr/bin/python

import timeit
timeit.timeit("import urllib; urllib.urlretrieve('http://localhost:5000', 'crimedata.json')", number=100)
#!/usr/bin/python

import timeit
total_time = timeit.timeit("import urllib; urllib.urlretrieve('http://crimedata.herokuapp.com/crimes/2012', 'crimedata.json')", number=100)
print total_time/100
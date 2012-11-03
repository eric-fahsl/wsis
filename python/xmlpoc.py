#from xml.dom import minidom
from bs4 import BeautifulSoup

xmlContent = ""
f = open('sampledata/49degnorth.xml')
for line in f :
	xmlContent += line

f.close()

rec = BeautifulSoup(xmlContent)
for p in rec.hash.periods :
	period = BeautifulSoup(p)
	print period
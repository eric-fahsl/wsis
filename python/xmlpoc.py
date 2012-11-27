from bs4 import BeautifulSoup
import urllib

def searchContentForTag(uniqueText, tagNameOpen, includeTagOpen, tagNameClose, includeTagClose, content, offset) :
        uniqueTextIndex = content.find(uniqueText, offset)
        tagNameIndex = content.find(tagNameOpen, uniqueTextIndex);
        if (includeTagOpen != True) :
            tagNameIndex += len(tagNameOpen)
        tagNameCloseIndex = content.find(tagNameClose, tagNameIndex)
        if (includeTagClose) :
            tagNameCloseIndex += len(tagNameClose)

        tagContent = content[tagNameIndex:tagNameCloseIndex]

        return [ tagContent, tagNameCloseIndex ]

def getSnowForecastTag(forecastLocation, tagName, content) :
	content = str(content)
	results = searchContentForTag(forecastLocation, tagName + "&gt;", False, "<", False, content, 0)
	return results[0]

snowUrl = "http://www.snow-forecast.com/resorts/White-Pass/feed.xml"
snowPage = urllib.urlopen(snowUrl)
soup = BeautifulSoup(snowPage)

i = 1
for p in soup.findAll('period') :
	#print "######################"
	#print str(p)
	print getSnowForecastTag("mid", "dayname", p) + " " + searchContentForTag("mid", "ename&gt;", False, "<", False, str(p), 0)[0]
	print i
	#print "######################"
	i += 1
	
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

def createSoup(url) :
	#snowUrl = "http://www.snow-forecast.com/resorts/White-Pass/feed.xml"
	snowPage = urllib.urlopen(url)
	soup = BeautifulSoup(snowPage)
	return soup


	
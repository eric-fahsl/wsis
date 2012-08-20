import httplib

remarkablesWierdString = "<span class=\"webkit-html-tag\">&lt;/span&gt;</span><span class=\"webkit-html-tag\">&lt;span&gt;</span>"
remarkablesWierdString = "<span>"

def searchContentForTag(uniqueText, tagNameOpen, tagNameClose, content, offset) :
	uniqueTextIndex = content.find(uniqueText, offset)
	tagNameIndex = content.find(tagNameOpen, uniqueTextIndex) + len(tagNameOpen)
	tagNameCloseIndex = content.find(tagNameClose, tagNameIndex)
	tagContent = content[tagNameIndex:tagNameCloseIndex]
	return tagContent

def scrapePageForSnowfall(host, path) :	
	conn = httplib.HTTPConnection(host)
	conn.request("GET", path)
	res = conn.getresponse()

	htmlContent = res.read()

	conn.close()

	lastUpdate = searchContentForTag("", "Report Generated On: ", "</span", htmlContent, 0)
	lastFall = searchContentForTag("Last Snow Fall: ", remarkablesWierdString, "</span", htmlContent, 0)
	baseUpper = searchContentForTag("Upper Mountain Depth:", remarkablesWierdString, "</span", htmlContent, 0)
	baseLower = searchContentForTag("Lower Mountain Depth:", remarkablesWierdString, "</span", htmlContent, 0)

	print "Last Updated: " + lastUpdate
	print "Last Snowfall on: " + lastFall
	print "Upper Mountain Depth: " + baseUpper
	print "Lower Mountain Depth: " + baseLower

	lastFallArray = lastFall.split(' ') 
	if (lastUpdate.find(lastFallArray[2]) >= 0 and lastUpdate.find(lastFallArray[3]) >= 0) :
		print "Hooray, it snowed today!"
	else :
		print "It did NOT snow today :("

print "Remarkables: "
scrapePageForSnowfall("www.nzski.com", "/reportPrint_theremarkables.jsp")
print "Coronet Peak:"
scrapePageForSnowfall("www.nzski.com", "/reportPrint_coronetpeak.jsp")
print "Mt Hutt:"
scrapePageForSnowfall("www.nzski.com", "/reportPrint_mthutt.jsp")
#scrapePageForSnowfall("remarkables-19Aug.html")


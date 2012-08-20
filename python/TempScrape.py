remarkablesWierdString = "<span class=\"webkit-html-tag\">&lt;/span&gt;</span><span class=\"webkit-html-tag\">&lt;span&gt;</span>"

def searchContentForTag(uniqueText, tagNameOpen, tagNameClose, content, offset) :
	uniqueTextIndex = content.find(uniqueText, offset)
	tagNameIndex = content.find(tagNameOpen, uniqueTextIndex) + len(tagNameOpen)
	tagNameCloseIndex = content.find(tagNameClose, tagNameIndex)
	tagContent = content[tagNameIndex:tagNameCloseIndex]
	return tagContent

def scrapePageForSnowfall(filename) :	
	fr = open(filename)

	htmlContent = ""
	for line in fr.readlines():
		line = line.strip()
		htmlContent += line

	lastUpdate = searchContentForTag("", "Report Generated On: ", "<span class=", htmlContent, 0)
	lastFall = searchContentForTag("Last Snow Fall: ", remarkablesWierdString, "<span", htmlContent, 0)
	baseUpper = searchContentForTag("Upper Mountain Depth:", remarkablesWierdString, "<span", htmlContent, 0)
	baseLower = searchContentForTag("Lower Mountain Depth:", remarkablesWierdString, "<span", htmlContent, 0)

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
scrapePageForSnowfall("remarkables-20Aug.html")
print "Coronet Peak:"
scrapePageForSnowfall("coronet-20Aug.html")
print "Mt Hutt:"
scrapePageForSnowfall("hutt-20Aug.html")
#scrapePageForSnowfall("remarkables-19Aug.html")


from bs4 import BeautifulSoup
import httplib
import urllib


alyeskaSnowUrl = "http://www.alyeskaresort.com/printable-snow-report.aspx"
snowPage = urllib.urlopen(alyeskaSnowUrl)

soup = BeautifulSoup(snowPage)

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

def scrapePageForResult(host, path) :
        #conn = httplib.HTTPConnection(host)
        #conn.request("GET", path)
        #res = conn.getresponse()

        #htmlContent = res.read()
        htmlContent = str(soup)

        #conn.close()

        offset = 0

        result = searchContentForTag("Midway", "<td class=\"cells\">", False, "</td>", False, htmlContent, offset)
        print "result: " + result[0] + ", offset: " + str(result[1])
        result2 = result

        for i in range(1,5) :
        	result2 = searchContentForTag("", "<td class=\"cells\">", False, "</td>", False, htmlContent, result2[1])
        	print "result: " + result2[0] + ", offset: " + str(result2[1])

        
#Connect to DB

#print "Remarkables: "
scrapePageForResult("www.alyeskaresort.com", "/printable-snow-report.aspx")

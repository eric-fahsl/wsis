import httplib
import datetime
import _mysql

remarkablesWierdString = "<span class=\"webkit-html-tag\">&lt;/span&gt;</span><span class=\"webkit-html-tag\">&lt;span&gt;</span>"
remarkablesWierdString = "<span>"

def searchContentForTag(uniqueText, tagNameOpen, tagNameClose, content, offset) :
        uniqueTextIndex = content.find(uniqueText, offset)
        tagNameIndex = content.find(tagNameOpen, uniqueTextIndex) + len(tagNameOpen)
        tagNameCloseIndex = content.find(tagNameClose, tagNameIndex)
        tagContent = content[tagNameIndex:tagNameCloseIndex]
        return tagContent

def scrapePageForSnowfall(host, path, resort_name) :
        conn = httplib.HTTPConnection(host)
        conn.request("GET", path)
        res = conn.getresponse()

        htmlContent = res.read()

        conn.close()

        lastUpdate = searchContentForTag("", "Report Generated On: ", "</span", htmlContent, 0)
        lastFall = searchContentForTag("Last Snow Fall: ", "<span>", "</span", htmlContent, 0)
        baseUpper = searchContentForTag("Upper Mountain Depth:", "<span>", "</span", htmlContent, 0)
        baseLower = searchContentForTag("Lower Mountain Depth:", "<span>", "</span", htmlContent, 0)
        mountainStatus = searchContentForTag("Mountain Status:", "<h2>","</h2>", htmlContent, 0 )
        snow_conditions = searchContentForTag("Snow Conditions:", "<h2>","</h2>", htmlContent, 0 )
        weather_conditions = searchContentForTag("Weather Conditions:", "<h2>","</h2>", htmlContent, 0 )        road_conditions = searchContentForTag("Road Conditions:", "<h2>","</h2>", htmlContent, 0 )        temperature = weather_conditions.split(',')[1]
        weather_conditions = weather_conditions.split(' ')[0]

        print "Last Updated: " + lastUpdate
        print "Mountain Status: " + mountainStatus
        print "Last Snowfall on: " + lastFall
        print "Upper Mountain Depth: " + baseUpper
        print "Lower Mountain Depth: " + baseLower
        print snow_conditions
        print weather_conditions
        print temperature

        lastFallArray = lastFall.split(' ')
        if (lastUpdate.find(lastFallArray[2]) >= 0 and lastUpdate.find(lastFallArray[3]) >= 0) :
                print "Hooray, it snowed today!"
        else :
                print "It did NOT snow today :("

        #check to make sure we don't already have this entry
        db.query("select count(*) from skiweather where report_time='" + lastUpdate + "'")
        res = db.store_result()

      	resultCount = res.fetch_row(0)[0][0]
        
        if (resultCount == '0') :
        
	        queryString = "INSERT INTO `skiweather` (`report_time`, `resort_name`, `modify_date`, `status`, `snow_conditions`, `weather_condition`, `temperature`, `road_conditions`, `last_snow_fall`, `last_snow_fall_date`, `lower_mountain_depth`, `upper_mountain_depth`) VALUES ("
	        queryString += "'" + lastUpdate +  "', "
	        queryString += "'" + resort_name + "',"
	        queryString += "'" + str(datetime.datetime.now()) + "',"
	        queryString += "'" + mountainStatus + "',"
	        queryString += "'" + snow_conditions + "',"
	        queryString += "'" + weather_conditions + "',"
	        queryString += "'" + temperature + "',"
	        queryString += "'" + road_conditions + "',"
	        queryString += "'" + lastFall.split(' ')[0] + "',"
	        queryString += "'" + lastFall + "',"
	        queryString += "'" + baseLower + "',"
	        queryString += "'" + baseUpper + "')"

	        print queryString
	        db.query(queryString)

#Connect to DB
db = _mysql.connect("localhost","data","data","data")

print "Remarkables: "
scrapePageForSnowfall("www.nzski.com", "/reportPrint_theremarkables.jsp", "Remarkables")
print "Coronet Peak:"
scrapePageForSnowfall("www.nzski.com", "/reportPrint_coronetpeak.jsp", "Coronet Peak")
print "Mt Hutt:"
scrapePageForSnowfall("www.nzski.com", "/reportPrint_mthutt.jsp", "Mt Hutt")
#scrapePageForSnowfall("remarkables-19Aug.html")

db.close()



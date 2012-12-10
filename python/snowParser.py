import xmlHelper


def getNewSnowFallForResort(resort, db) :

    weatherReportPage = resort['resort_website_weather_url']
    soup = xmlHelper.createSoup(weatherReportPage)

    newSnow = 0
    sampleCommand = 'xmlHelper.searchContentForTag("Summit","Last 24 hrs:","lh26\">", "</span", str(soup), 0)'
    exec "newSnow = " + sampleCommand
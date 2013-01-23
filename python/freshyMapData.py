import os
import datetime

freshyMapLocation = "http://freshymap.com/mountains"
dateString = datetime.date.today()
command = 'curl "' + freshyMapLocation + '" > ~/snowfall_totals/' + str(dateString) + '.json'
print command
os.system(command)

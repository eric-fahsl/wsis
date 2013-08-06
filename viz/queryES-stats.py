import requests, json

REPLACETERM = "REPLACETERM"

queryString = '\
{\
    "query": {\
        "filtered": {\
            "query": {\
                "bool": {\
                    "must": [ \
                    {\
                            "term": {\
                                ' + REPLACETERM  + '\
                            }\
                        },\
                        {\
                            "range": {\
                                "date": {\
                                    "lte": "2013-04-21"\
                                }\
                            }\
                        }\
                    ]                  \
                }\
            }\
        }\
    },\
    "facets" : {\
        "Powder" : {\
            "statistical" : {\
                "field" : "powder.rating"\
            }\
        }, \
        "Bluebird" : {\
            "statistical" : {\
                "field" : "bluebird.rating"\
            }\
        }, \
        "Freezing Level" : {\
            "statistical" : {\
                "field" : "freezing_level.rating"\
            }\
        }\
    },\
    "size": 0\
}'

es_url = "http://localhost:9200/recommendations/_search"

#relevant_date = "2012-12-20"
def retrieveStats(search_term) :

	#data = json.dumps(queryString.replace(REPLACETERM,search_term)) 
	data = queryString.replace(REPLACETERM,search_term)
	r = requests.post(es_url, data)

	#response_data = r.json()
	return r.json()

RESORTS_LIST= "49 Degrees North,Crystal Mountain,Hurricane Ridge,Loup Loup Ski Bowl,Mission Ridge,Mount Baker,Mount Spokane,Ski Bluewood,Stevens Pass,Snoqualmie - Alpental,White Pass,Anthony Lakes,Hoodoo,Mount Ashland,Mount Bachelor,Mount Hood Meadows,Mount Hood Skibowl,Timberline,Willamette Pass,Bogus Basin,Brundage,Kelly Canyon,Lookout Pass,Magic Mountain ,Pebble Creek,Pomerelle,Schweitzer,Silver Mountain,Soldier Mountain,Sun Valley,Tamarack,Big Sky,Blacktail Mountain,Bridger Bowl,Discovery Basin,Great Divide,Lost Trail Powder Mountain,Maverick Mountain,Montana Snow Bowl,Moonlight Basin,Red Lodge,Showdown,Teton Pass,Turner Mountain,Whitefish Mountain,Alyeska,Jackson Hole,Antelope Butte,Grand Targhee,Snowy Range,Sleeping Giant,Snow King,White Pine,Alta,Brighton,Snowbird,Solitude,Canyons,Deer Valley,Park City,Sundance,Beaver Mountain,Powder Mountain,Snowbasin,Brian Head,Eagle Point,Taos,Angel Fire,Pajarito Mountain,Red River,Sandia Peak,Sipapu,Ski Apache,Ski Santa Fe,Sugar Bowl,Squaw Valley USA,Alpine Meadows,Bear Mountain,Bear Valley Mountain,China Peak,Dodge Ridge,Heavenly,Homewood Mountain,Kirkwood,Mammoth Mountain,Mountain High,Mt. Baldy,Mt. Shasta,Northstar-at-Tahoe,Sierra-at-Tahoe,Snow Summit Mountain,Arapahoe Basin,Aspen Heights,Aspen Mountain,Winter Park,Buttermilk,Copper Mountain,Crested Butte,Eldora,Loveland,Monarch,Powderhorn,Purgatory,Silverton,Ski Cooper,Snowmass,Steamboat,Sunlight,Telluride,Wolf Creek,Keystone,Alpenglow,Eaglecrest Ski Area,Big White,Fernie Alpine,Kicking Horse Mountain,Kimberley Alpine,Mount Washington Alpine,Panorama Mountain,Red Mountain,Silver Star Mountain,Sun Peaks Resort,Whistler Blackcomb,Mad River Glen,Sugarbush,Stowe,Smugglers Notch,Jay Peak,Killington,Sunday River,Sugarloaf,Wildcat Mountain,Cannon Mountain,Whiteface Mountain,Afton Alps,Hyland,Lutsen,Powder Ridge,Cascade Mountain,Devils Head,Alpine Valley,Granite Peak,Whitecap Mountain,Mt Rose,Mount Bohemia,Boyne,Marquette,Porcupine,Whitewater,Diamond Peak,Las Vegas Ski and Snowboard,Arizona Snowbowl".split(',')
STATES_LIST = "AK,AZ,BC,CA,CO,ID,ME,MI,MN,MT,NH,NM,NV,NY,OR,UT,VT,WA,WI,WY".split(',')
FIELDS = [ "Powder", "Bluebird", "Freezing Level" ]

#iterate through the list of states and retrieve the relevant stats
#print queryString

headerRow = "State"
for field in FIELDS :
	headerRow += ',' + field + ' mean,' + field + ' stdev'
print headerRow

for element in RESORTS_LIST :
	response_data = retrieveStats('"resort_name": "' + element + '"')
	#print json.dumps(response_data)

	row = element 
	for field in FIELDS :
		mean = response_data['facets'][field]['mean']
		stdev = response_data['facets'][field]['std_deviation']
		row += ',' + str(mean) + ',' + str(stdev)

	print row

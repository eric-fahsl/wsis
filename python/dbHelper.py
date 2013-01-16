#######################################
# Utility for creating DB statements  #
#######################################

def createInsertStatement(row, tableName, update=True) :
	queryString = "INSERT "
	if not update :
		queryString += "IGNORE "
	queryString += "INTO " + tableName + " "

	updateString = ""
	firstTime = True;
	columnNames = "("
	columnValues = "("
	for key, val in row.iteritems(): 
		if (firstTime != True):
			columnNames += ", "
			columnValues += ", "
			updateString += ", "
		columnNames += key
		columnValues += "'" + str(val) + "'"
		updateString += key + "='" + str(val) + "'"
		firstTime = False
	columnNames += ")"
	columnValues += ")"

	queryString += columnNames + " values " + columnValues
	if update :
		queryString += " ON DUPLICATE KEY UPDATE " + updateString

	return queryString


def checkForSnowfallEntryQuery(snowfallEntry, tableName) :
	queryString = "SELECT count(*) from " + tableName 
	queryString += " WHERE resort=" + snowfallEntry['resort']
	queryString += " and updated_time='" + snowfallEntry['updated_time'] + "'"
	return queryString

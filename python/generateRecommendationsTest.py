import _mysql
import createRecommendations

#Connect to DB
db = _mysql.connect("localhost","wsis","wsis","wsis")

createRecommendations.create(db)

db.close()
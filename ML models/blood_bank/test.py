from pymongo import MongoClient

MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["AarogyaSaarthi"]
collection = db["BloodBank"]

latest_entry = collection.find_one({}, {"_id": 0})

print(latest_entry)  # Print the latest document

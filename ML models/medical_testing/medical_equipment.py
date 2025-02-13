import joblib
import pandas as pd
from pymongo import MongoClient
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import os

# MongoDB Connection
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")  
db = client["AarogyaSaarthi"]
collection = db["Bed"]

MODEL_PATH = "medical_equipment_model.pkl"

def fetch_data():
    """Fetches data from MongoDB and preprocesses it."""
    data = list(collection.find({}, {'_id': 0}))  # Exclude `_id` field
    df = pd.DataFrame(data)

    if df.empty:
        raise ValueError("No data found in MongoDB collection.")

    # Encode categorical variable
    le = LabelEncoder()
    df['Equipments'] = le.fit_transform(df['Equipment_Type'])

    # Prepare features and target
    X = df.drop(columns=['Equipment_Type'])
    Y = df['Equipment_Availability']
    
    return X, Y

def train_and_save_model():
    """Trains and saves the ML model using MongoDB data."""
    try:
        X, Y = fetch_data()
        X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

        model = RandomForestClassifier()
        model.fit(X_train, Y_train)

        # Save model
        joblib.dump(model, MODEL_PATH)
        print("✅ Model trained and saved successfully!")
    except Exception as e:
        print(f"❌ Error training model: {e}")

def load_model():
    """Loads the saved model or trains a new one if not found."""
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    else:
        print("⚠️ Model not found, training a new one...")
        train_and_save_model()
        return joblib.load(MODEL_PATH)

if __name__ == "__main__":
    train_and_save_model()  # Run this script to train & save the model

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
collection = db["MedicalEquipments"]

def fetch_data():
    """Fetches data from MongoDB and preprocesses it."""
    data = list(collection.find({}, {'_id': 0}))  # Exclude `_id` field
    df = pd.DataFrame(data)

    if df.empty:
        raise ValueError("No data found in MongoDB collection.")

    return df

def train_and_save_models():
    """Trains and saves separate models for each equipment type."""
    try:
        df = fetch_data()
        
        # Encode categorical variables
        le = LabelEncoder()
        df['Equipments'] = le.fit_transform(df['Equipment_Type'])
        
        # Get unique equipment types
        equipment_types = df['Equipment_Type'].unique()

        for equipment in equipment_types:
            equipment_data = df[df['Equipment_Type'] == equipment]
            
            if len(equipment_data) < 2:
                print(f"Skipping {equipment} due to insufficient data.")
                continue

            X = equipment_data.drop(columns=['Equipment_Type', 'Equipment_Availability'])
            Y = equipment_data['Equipment_Availability']
            
            X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)
            
            model = RandomForestClassifier()
            model.fit(X_train, Y_train)
            
            model_filename = f"{equipment.replace(' ', '_').lower()}_model.joblib"
            joblib.dump(model, model_filename)
            print(f"Model for {equipment} saved as {model_filename}")

        print("All models trained and saved successfully!")
    except Exception as e:
        print(f"Error training models: {e}")

if __name__ == "__main__":
    train_and_save_models()

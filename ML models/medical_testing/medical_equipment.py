import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")
db = client["AarogyaSaarthi"]
collection = db["MedicalEquipments"]

# Load dataset from MongoDB
data = pd.DataFrame(list(collection.find()))

# Strip leading and trailing spaces from column names
data.columns = data.columns.str.strip()

# Drop the _id column since it's not needed for the model
data = data.drop(columns=['_id'])

# Ensure numerical columns are properly formatted
data['Number_of_Patients'] = pd.to_numeric(data['Number_of_Patients'], errors='coerce')
data['Number_of_Staff'] = pd.to_numeric(data['Number_of_Staff'], errors='coerce')
data['Equipment_Availability'] = pd.to_numeric(data['Equipment_Availability'], errors='coerce')

# Get all unique equipment types
equipment_types = data['Equipment_Type'].unique()

# Train and save a separate Linear Regression model for each equipment type
for equipment in equipment_types:
    equipment_data = data[data['Equipment_Type'] == equipment]

    # Check if there's enough data for training
    if len(equipment_data) < 2:
        print(f"Skipping {equipment} due to insufficient data.")
        continue

    # Create time steps (assuming past stock data is time-sequenced)
    X = np.array(range(len(equipment_data))).reshape(-1, 1)  # Time steps
    y = equipment_data['Equipment_Availability'].values  # Equipment availability values

    # Split data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Linear Regression model
    linear_model = LinearRegression()
    linear_model.fit(X_train, y_train)

    # Save the model with a unique name
    model_filename = f"{equipment.replace(' ', '_').lower()}_model.joblib"
    joblib.dump(linear_model, model_filename)
    print(f"Model for {equipment} saved as {model_filename}")

print("All models trained and saved successfully!")

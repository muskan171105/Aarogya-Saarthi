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
data['Equipment_Availability'] = pd.to_numeric(data['Equipment_Availability'], errors='coerce')
data['Stock_Availability'] = pd.to_numeric(data['Stock_Availability'], errors='coerce')

# Get all unique equipment types
equipment_types = data['Equipment_Type'].unique()

# Dictionary to store predicted stock for each equipment
predicted_stock = {}

# Train and save a separate Linear Regression model for each equipment type
for equipment in equipment_types:
    equipment_data = data[data['Equipment_Type'] == equipment]

    # Check if there's enough data for training
    if len(equipment_data) < 2:
        print(f"Skipping {equipment} due to insufficient data.")
        continue

    # Create time steps (assuming past stock data is time-sequenced)
    X = equipment_data[['Equipment_Availability']].values  # Features
    y = equipment_data['Stock_Availability'].values  # Target

    # Split data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Linear Regression model
    linear_model = LinearRegression()
    linear_model.fit(X_train, y_train)

    # Predict stock availability for the next **3 months (30, 60, 90 days)**
    future_availability = np.array([[30], [60], [90]])  # Only 3 values
    future_stock = linear_model.predict(future_availability)

    # Round predictions to nearest integer and store
    predicted_stock[equipment] = [round(value) for value in future_stock]

    # Save the model
    model_filename = f"{equipment.replace(' ', '_').lower()}_model.joblib"
    joblib.dump(linear_model, model_filename)

# Print the final 3-value prediction for each equipment type
print({"predicted_stock": predicted_stock})

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")
db = client["AarogyaSaarthi"]
collection = db["DiagnosticEquipments"]

# Load dataset from MongoDB
data = pd.DataFrame(list(collection.find()))

# Strip leading and trailing spaces from column names
data.columns = data.columns.str.strip()

# Drop the _id column since it's not needed for the model
data = data.drop(columns=['_id'])

# Ensure 'stock_available' column is numeric
data['stock_available'] = pd.to_numeric(data['stock_available'], errors='coerce')

# Get all unique equipment names
equipment_names = data['diagnostic_equipments'].unique()

# Train and save a separate Linear Regression model for each equipment
for equipment in equipment_names:
    equipment_data = data[data['diagnostic_equipments'] == equipment]

    # Check if there's enough data for training
    if len(equipment_data) < 2:
        print(f"Skipping {equipment} due to insufficient data.")
        continue

    # Create time steps (assuming past stock data is time-sequenced)
    X = np.array(range(len(equipment_data))).reshape(-1, 1)  # Time steps
    y = equipment_data['stock_available'].values  # Stock values

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

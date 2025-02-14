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

# Ensure 'Equipment_Availability' column is numeric
data['Equipment_Availability'] = pd.to_numeric(data['Equipment_Availability'], errors='coerce')

# Get all unique equipment types
equipment_types = data['Equipment_Type'].unique()

# Dictionary to store predictions
predictions = {}

# Train, save, and predict for each equipment type
for equipment in equipment_types:
    equipment_data = data[data['Equipment_Type'] == equipment]

    # Check if there's enough data for training
    if len(equipment_data) < 2:
        print(f"Skipping {equipment} due to insufficient data.")
        continue

    # Create time steps (assuming past stock data is time-sequenced)
    X = np.array(range(len(equipment_data))).reshape(-1, 1)  # Time steps
    y = equipment_data['Equipment_Availability'].values  # Availability values

    # Split data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Linear Regression model
    linear_model = LinearRegression()
    linear_model.fit(X_train, y_train)

    # Save the model with a unique name
    model_filename = f"{equipment.replace(' ', '_').lower()}_model.joblib"
    joblib.dump(linear_model, model_filename)
    print(f"Model for {equipment} saved as {model_filename}")

    # Predict the next time step availability
    next_time_step = np.array([[len(equipment_data)]])
    predicted_availability = linear_model.predict(next_time_step)[0]
    predictions[equipment] = predicted_availability

# Print real-time predictions
print("\nPredicted Equipment Availability for Next Time Step:")
for equipment, availability in predictions.items():
    print(f"{equipment}: {availability:.2f}")

print("\nAll models trained, saved, and predictions generated successfully!")

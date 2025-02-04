import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["hospitalDB"]
collection = db["diagnostic_collection"]

# Load dataset from MongoDB
data = pd.DataFrame(list(collection.find()))

# Strip leading and trailing spaces from column names
data.columns = data.columns.str.strip()

# Drop the _id column since it's not needed for the model
data = data.drop(columns=['_id'])

# Ensure 'stock_available' column is numeric
data['stock_available'] = pd.to_numeric(data['stock_available'], errors='coerce')

# Encode categorical equipment names
le = LabelEncoder()
data['Equipment'] = le.fit_transform(data['diagnostic_equipments'])  # Correct column name

# Define features (X) and target (y)
X = data.drop(columns=['diagnostic_equipments', 'stock_available'])  # Exclude diagnostic_equipments and stock_available from X
y = data["stock_available"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model
rf_model = RandomForestClassifier(random_state=42)
rf_model.fit(X_train, y_train)

# Train Linear Regression model for future stock prediction
linear_model = LinearRegression()
X_numeric = np.array(range(len(y))).reshape(-1, 1)
linear_model.fit(X_numeric, y)

# Save models using joblib
joblib.dump(rf_model, "rf_model.joblib")
joblib.dump(linear_model, "linear_model.joblib")
joblib.dump(le, "label_encoder.joblib")

print("Models trained and saved successfully!")

# Importing required libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
import joblib
from pymongo import MongoClient

# MongoDB Connection
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")
db = client["AarogyaSaarthi"]
collection = db["PPE"]

# Fetch data from MongoDB
df = pd.DataFrame(list(collection.find()))

# Check if data is retrieved
if df.empty:
    print("No matching data found in MongoDB.")
    exit()

# Remove unwanted MongoDB ObjectId column
if '_id' in df.columns:
    df = df.drop(columns=['_id'])

# Define features (X) and target (y)
X = df[['no_of_staff', 'Avg_Monthly_PPE_Consumption', 'ECLW']]  # Ensure these columns exist
y = df[['PPE_Kits_Available_in_october', 'PPE_Kits_Available_in_November', 
        'PPE_Kits_Available_in_December', 'PPE_Kits_Available_in_January']]  # Ensure these columns exist

# Splitting the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=2)

# Training the Linear Regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Saving the trained model
joblib.dump(model, 'ppe_model.pkl')

# Making predictions
train_preds = model.predict(X_train)
test_preds = model.predict(X_test)

# Calculating R² scores
train_r2 = r2_score(y_train, train_preds)
test_r2 = r2_score(y_test, test_preds)

print(f"R² Score on Training Data: {train_r2:.6f}")
print(f"R² Score on Testing Data: {test_r2:.6f}")

# Example input for prediction (Ensure it matches the model's expected features)
input_data = np.array([[250, 250, 110]])  # 3 features
prediction = model.predict(input_data)

print("\nPredicted PPE Kits:")
print(f'March: {int(abs(prediction[0][0]))}')
print(f'April: {int(abs(prediction[0][1]))}')
print(f'May: {int(abs(prediction[0][2]))}')
print(f'June: {int(abs(prediction[0][3]))}')

# Sample data for visualization
data = [200, 100, 110, 115, int(prediction[0][0]), int(prediction[0][1]), int(prediction[0][2]), int(prediction[0][3])]
months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']

# Plot PPE Kit predictions
plt.figure(figsize=(10, 5))
plt.plot(data, marker='o', linestyle='-', color='blue')

plt.xticks(ticks=range(len(months)), labels=months)
plt.title("PPE Kits Prediction")
plt.xlabel("Months")
plt.ylabel("PPE Kits")
plt.grid(True)
plt.show()

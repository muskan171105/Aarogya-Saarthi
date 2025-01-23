import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# 1. Load Dataset
# Replace 'your_dataset.csv' with your actual dataset file path.
# Ensure your CSV file contains columns: "Bed_Count", "Doctors_Available", "X_Ray_Machines_Available".
df = pd.read_csv('/content/XRAY MACHINE PREDICTION.csv')

# Rename columns if necessary
df.columns = ['Bed_Count', 'Doctors_Available', 'X_Ray_Machines_Available']

# 2. Split Features and Target
X = df[['Bed_Count', 'Doctors_Available']]  # Features
y = df['X_Ray_Machines_Available']           # Target

# 3. Split Data into Train and Test Sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Build and Train the Model
pipeline = Pipeline([
    ("scaler", StandardScaler()),  # Scaling features for better performance
    ("model", RandomForestRegressor(n_estimators=100, random_state=42))
])

pipeline.fit(X_train, y_train)

# 5. Make Predictions
y_train_pred = pipeline.predict(X_train)  # Predictions on training data
y_test_pred = pipeline.predict(X_test)   # Predictions on testing data

# 6. Evaluate Model Performance
train_mse = mean_squared_error(y_train, y_train_pred)
train_r2 = r2_score(y_train, y_train_pred)

test_mse = mean_squared_error(y_test, y_test_pred)
test_r2 = r2_score(y_test, y_test_pred)

# Display Results
#print("Training Performance:")
#print("  Mean Squared Error (MSE):", train_mse)
#print("  R² Score:", train_r2)

#print("\nTesting Performance:")
#print("  Mean Squared Error (MSE):", test_mse)
#print("  R² Score:", test_r2)

A = int(input("Enter the number of Patients : "))
if (A>360):
  print("Number of X-Ray machines are 1")
elif(A>270 and A<360):
  print("Number of X-Ray machines are 2")
elif(A>180 and A<270):
  print("Number of X-Ray machines are 3")
elif(A>90 and A<180):
  print("Number of X-Ray machines are 4")
elif(A>0 and A<90):
  print("Number of X-Ray machines are 5")
else:
  print("No X ray Machines available")  

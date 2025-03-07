import numpy as np
import pandas as pd
import os
import random
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
import joblib  # Import joblib to save the model

# Load dataset
dataset = pd.read_csv('ventilator_dataset.csv')

# Define features and target
X = dataset[['Oct', 'Nov', 'Dec', 'Jan', 'Feb']]
y = dataset[['Mar', 'Apr', 'May', 'Combined']]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Save the trained model to a file
joblib.dump(model, 'ventilator_model.pkl')  # Save the model

# Make predictions
train_predictions = model.predict(X_train)
test_predictions = model.predict(X_test)

# Calculate evaluation metrics (optional)
# train_mse = mean_squared_error(y_train, train_predictions)
# test_mse = mean_squared_error(y_test, test_predictions)
# train_r2 = r2_score(y_train, train_predictions)
# test_r2 = r2_score(y_test, test_predictions)

# Print evaluation metrics (optional)
# print(f"Training MSE: {train_mse}")
# print(f"Testing MSE: {test_mse}")
# print(f"Training R2 Score: {train_r2}")
# print(f"Testing R2 Score: {test_r2}")

# Make a prediction for new input data
input_data = ([100, 108, 105, 102, 110])
input_data_as_numpy_array = np.asarray(input_data)
input_data_reshaped = input_data_as_numpy_array.reshape(1, -1)
prediction = model.predict(input_data_reshaped)

print('Number of Ventilators required in March are:', int(prediction[0][0]) - 100)
print('Number of Ventilators required in April are:', int(prediction[0][1]) - 100)
print('Number of Ventilators required in May are:', int(prediction[0][2]) - 100)
print('Number of Ventilators required for next 3 months are:', int(prediction[0][3]) - 100)

# Data array for visualization
data = [100, 108, 105, 102, 110, 112, 106, 113, 114]
months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Next 3 Months']
plt.figure(figsize=(10, 5))
plt.plot(data, marker='o', linestyle='-', color='blue')

# Add month names on the x-axis
plt.xticks(ticks=range(len(months)), labels=months)
plt.title("Ventilator Count Plot")
plt.xlabel("Months")
plt.ylabel("Ventilator Count")
plt.grid(True)
plt.show()
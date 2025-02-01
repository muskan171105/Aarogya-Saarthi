import numpy as np
import pandas as pd
import os
import random
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
import tensorflow as tf

# Load dataset
dataset = pd.read_csv('/content/Book2.csv')


# Define features and target
X = dataset[['October', 'November', 'December', 'January','Febuary']]
y = dataset[['March','April','May','Combined']]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
train_predictions = model.predict(X_train)
test_predictions = model.predict(X_test)

# Calculate evaluation metrics
#train_mse = mean_squared_error(y_train, train_predictions)
#test_mse = mean_squared_error(y_test, test_predictions)
#train_r2 = r2_score(y_train, train_predictions)
#test_r2 = r2_score(y_test, test_predictions)

#Print evaluation metrics
#print(f"Training MSE: {train_mse}")
#print(f"Testing MSE: {test_mse}")
#print(f"Training R2 Score: {train_r2}")
#print(f"Testing R2 Score: {test_r2}")


# Training data
#plt.subplot(1, 2, 1)
#plt.scatter(y_train, train_predictions, alpha=0.7, color='blue')
#plt.title('Predicted Bed Counts')
#plt.xlabel('Number of Patients')
#plt.ylabel('Beds Available')
#plt.plot([y_train.min(), y_train.max()], [y_train.min(), y_train.max()], 'k--', color='red')
input_data=([500,503,504,501,522])
input_data_as_numpy_array=np.asarray(input_data)
input_data_reshaped=input_data_as_numpy_array.reshape(1,-1)
prediction=model.predict(input_data_reshaped)
print('Number of Beds required in March are:',int(prediction[0][0])-500)
print('Number of Beds required in April are:',int(prediction[0][1])-500)
print('Number of Beds required in May are:',int(prediction[0][2])-500)
print('Number of Beds required for next 3 months are:',int(prediction[0][3])-500)


<<<<<<< HEAD
# Bed availability logic
A = 450
B = int(input("Enter the number of patients: "))
if B > A:
    print(B - A, "more Beds are needed")
elif A - B == 0:
    print("All the beds are in use")
else:
    print(A - B, "Beds are available")
=======

# Data array
data = [500, 503, 504, 501, 522, 523, 518, 530, 532]
months = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Next 3 Months']
plt.figure(figsize=(10, 5))
plt.plot(data, marker='o', linestyle='-', color='blue')

# Add month names on the x-axis
plt.xticks(ticks=range(len(months)), labels=months)
plt.title("Bed Count Plot")
plt.xlabel("Months")
plt.ylabel("Beds")
plt.grid(True)
plt.show()
>>>>>>> a84d912ab0effd8e010f953ef3e319fd4c0fc4f4

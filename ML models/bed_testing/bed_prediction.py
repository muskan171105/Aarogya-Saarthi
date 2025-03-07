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
dataset = pd.read_csv('bed_dataset.csv')


# Define features and target
X = dataset[['October', 'November', 'December', 'January','February']]
y = dataset[['March','April','May','Combined']]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
train_predictions = model.predict(X_train)
test_predictions = model.predict(X_test)

input_data=([500,503,504,501,522])
input_data_as_numpy_array=np.asarray(input_data)
input_data_reshaped=input_data_as_numpy_array.reshape(1,-1)
prediction=model.predict(input_data_reshaped)
print('Number of Beds required in March are:',int(prediction[0][0])-500)
print('Number of Beds required in April are:',int(prediction[0][1])-500)
print('Number of Beds required in May are:',int(prediction[0][2])-500)
print('Number of Beds required for next 3 months are:',int(prediction[0][3])-500)

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

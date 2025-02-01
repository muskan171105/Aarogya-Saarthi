# importing the dependencies 

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

#Loading the dataset

df=pd.read_csv('/content/Updated_PPE_Kit_Availability_Dataset.csv')

#removing the columns which containing missing values 
df=df.dropna(axis=1,how='all')

X=df.drop(columns=['PPE_Kits_Available_in_october','PPE Kits Available in November','PPE Kits Available in December','PPEKAIJ'])
y=df[['PPE_Kits_Available_in_october','PPE Kits Available in November','PPE Kits Available in December','PPEKAIJ']]

X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2,random_state=2)

model=LinearRegression()

model.fit(X_train,y_train)

training_data_prediction=model.predict(X_train)
training_data_accuacy=r2_score(y_train,training_data_prediction)
# print('Accuracy on training data:',training_data_accuacy)

testing_data_prediction=model.predict(X_test)
testing_data_accuacy=r2_score(y_test,testing_data_prediction)
# print('Accuracy on testing data:',testing_data_accuacy)
#Backend code added here 
input_data=([250,250,110])
input_data_as_numpy_array=np.asarray(input_data)
input_data_reshaped=input_data_as_numpy_array.reshape(1,-1)
prediction=model.predict(input_data_reshaped)
print('Number of PPE kits available in march',abs(int(prediction[0][0])))
print('Number of PPE kits available in april',abs(int(prediction[0][1])))
print('Number of PPE kits available in may',abs(int(prediction[0][2])))

# Sample data for demonstration

data = [200,100,110,115,int(prediction[0][0]),int(prediction[0][1]),int(prediction[0][2])]
months = ['oct','nov','dec','jan','feb','mar','apr','may']

plt.figure(figsize=(10, 5))
plt.plot(data, marker='o', linestyle='-', color='blue')

# Add month names on the x-axis

plt.xticks(ticks=range(len(months)), labels=months)

plt.title("PPE kits Plot")
plt.xlabel("Months")
plt.ylabel("PPE kits")
plt.grid(True)
plt.show()

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score


dataset = pd.read_csv('/content/Book.csv.csv')


  

X = dataset[['Total Beds', 'Number of Patients']]
y = dataset['Total Beds Available ']


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


model = RandomForestRegressor(random_state=42)


model.fit(X_train, y_train)


train_predictions = model.predict(X_train)
test_predictions = model.predict(X_test)


train_mse = mean_squared_error(y_train, train_predictions)
test_mse = mean_squared_error(y_test, test_predictions)
train_r2 = r2_score(y_train, train_predictions)
test_r2 = r2_score(y_test, test_predictions)

# Print evaluation metrics
#print(f"Training MSE: {train_mse}")
#print(f"Testing MSE: {test_mse}")
#print(f"Training R2 Score: {train_r2}")
#print(f"Testing R2 Score: {test_r2}")

A = 450
B = int(input("Enter the number of patients: "))
if (B>A):
  print("No beds available")
elif(A-B == 0):
  print("NO Beds available")
else: 
  print(A-B ,"Beds are available")

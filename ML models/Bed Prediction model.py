import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns

# Load dataset
dataset = pd.read_csv('/content/Book.csv.csv')

# Define features and target
X = dataset[['Total Beds', 'Number of Patients']]
y = dataset['Total Beds Available ']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = RandomForestRegressor(random_state=42)
model.fit(X_train, y_train)

# Make predictions
train_predictions = model.predict(X_train)
test_predictions = model.predict(X_test)

# Calculate evaluation metrics
train_mse = mean_squared_error(y_train, train_predictions)
test_mse = mean_squared_error(y_test, test_predictions)
train_r2 = r2_score(y_train, train_predictions)
test_r2 = r2_score(y_test, test_predictions)

# Print evaluation metrics
#print(f"Training MSE: {train_mse}")
#print(f"Testing MSE: {test_mse}")
#print(f"Training R2 Score: {train_r2}")
#print(f"Testing R2 Score: {test_r2}")


# Training data
plt.subplot(1, 2, 1)
plt.scatter(y_train, train_predictions, alpha=0.7, color='blue')
plt.title('Predicted Bed Counts')
plt.xlabel('Number of Patients')
plt.ylabel('Beds Available')
plt.plot([y_train.min(), y_train.max()], [y_train.min(), y_train.max()], 'k--', color='red')








# Bed availability logic
A = 450
B = int(input("Enter the number of patients: "))
if B > A:
    print("No beds available")
elif A - B == 0:
    print("No Beds available")
else:
    print(A - B, "Beds are available")

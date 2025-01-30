import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

file_path = '/content/Ventilator model.csv'
data = pd.read_csv(file_path)

# Rename columns as needed (adjust based on dataset structure)
data.columns = ['Patients_in_ICU', 'Doctors_Available','Ventilators_Available']  #

# Features and target
X = data[['Patients_in_ICU', 'Doctors_Available']]
y = data['Ventilators_Available']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build and train the model
pipeline = Pipeline([
    ("scaler", StandardScaler()),  # Scaling the features
    ("model", RandomForestRegressor(n_estimators=100, random_state=42))
])
pipeline.fit(X_train, y_train)

# Evaluate the model
y_train_pred = pipeline.predict(X_train)
y_test_pred = pipeline.predict(X_test)

train_mse = mean_squared_error(y_train, y_train_pred)
train_r2 = r2_score(y_train, y_train_pred)
test_mse = mean_squared_error(y_test, y_test_pred)
test_r2 = r2_score(y_test, y_test_pred)

# Print the evaluation results
#print("\nModel Performance:")
#print(f"Training MSE: {train_mse}")
#print(f"Training R² Score: {train_r2}")
#print(f"Testing MSE: {test_mse}")
#print(f"Testing R² Score: {test_r2}")

D = int(input("Enter the number of patients in ICU: "))
if(D<100):
  print ("The number of ventilators available are", 100-D)
else:
  print(D-100, "ventilators are needed") 


# 3. Feature Relationships with Target Variable
plt.figure(figsize=(8, 6))
sns.scatterplot(data=data, x='Patients_in_ICU', y='Ventilators_Available', color='blue', label='Patients in ICU')
plt.title('Patients in ICU vs Ventilators Available')
plt.xlabel('Patients in ICU')
plt.ylabel('Ventilators Available')
plt.legend()
plt.show()

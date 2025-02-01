import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

# Load the dataset
file_path = "/content/Diagnostic Equipments.csv"  # Replace with your file path
data = pd.read_csv(file_path)

le = LabelEncoder()

data['Equipment'] = le.fit_transform(data['Diagnostic equipments'])



# Define features (X) and target (y)
X = data.drop(columns=['Diagnostic equipments'])  # Replace with your target column name
y = data["Number of stocks available"]

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize the Random Forest Classifier
model = RandomForestClassifier(random_state=42)

# Train the model
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Evaluate the model
#accuracy = accuracy_score(y_test, y_pred)
#print(f"\nModel Accuracy: {accuracy * 100:.2f}%")

S = str(input("Enter the Equipment you want: "))
if(S=="ECG Machine"):
  print("ECG Machines available are 15")

    
elif(S=="Pulse Oximeter"):
  print("Pulse Oximeter available are 80")
elif(S=="Thermometers"):
  print("Thermometers available are 250")
elif(S=="Blood Pressure monitors"):
  print("Blood Pressure monitors available are 150")
elif(S=="Sphygmomanometers"):
  print("Sphygmomanometers available are 100")  
elif(S=="Electrocardiography"):
  print("Electrocardiography available are 10")
elif(S=="Opthalmoscopes"):
  print("Opthalmoscopes available are 15")
elif(S=="Otoscopes"):
  print("Otoscopes available are 15")
elif(S=="Bedside Monitors"):
  print("Bedside Monitors available are 70")
elif(S=="Dopplers"):
  print("Dopplers available are 20")
elif(S=="Centrifuge"):
  print("Centrifuge available are 10")
elif(S=="Incubator"):
  print("Incubator available are 20")
elif(S=="Scales"):
  print("Scales available are 50")
elif(S=="Binocular Loupes"):
  print("Binocular Loupes available are 10")
elif(S=="Diagnostic Sets"):
  print("Diagnostic Sets available are 20")
elif(S=="Imaging Equipment"):
  print("Imaging Equippment available are 15")
elif(S=="Stethoscopes"):
  print("Stethoscopes available are 200")
elif(S=="CT Scan Machines"):
  print("CT Scan Machines available are 4")                          
elif(S=="MRI Machines"):
  print("MRI Machines available are 3")
elif(S=="Laboratory Analyzers"):
  print("Laboratory Analyzers available are 15")
elif(S=="Ultrasound Machines"):
  print("Ultrasound Machines available are 20")
elif(S=="ESR Analyzer"):
  print("ESR Analyzer available are 4")
elif(S=="X-Ray Machines"):
  print("X-Ray Machines Available are 5")   
else:
  print(S ,"is not available") 
# Visualization for stock availability
sns.set(style="whitegrid")
plt.figure(figsize=(12, 8))
sorted_data = data.sort_values(by="Number of stocks available", ascending=False)
sns.barplot(x="Number of stocks available", y="Diagnostic equipments", data=sorted_data, palette="Blues_r")

plt.title("Stock Availability of Diagnostic Equipment", fontsize=16)
plt.xlabel("Number of Stocks Available", fontsize=14)
plt.ylabel("Diagnostic Equipment", fontsize=14)
plt.show()

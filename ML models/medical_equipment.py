import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder,StandardScaler
from sklearn.compose  import make_column_transformer
from sklearn.preprocessing import OneHotEncoder,MinMaxScaler
df=pd.read_csv('/content/medical_equipment_dataset 3.csv')
le=LabelEncoder()
df['Equipments']=le.fit_transform(df['Equipment_Type'])
X=df.drop(columns=['Equipment_Type'])
Y=df['Equipment_Availability']
X_train,X_test,Y_train,Y_test=train_test_split(X,Y,test_size=0.2,random_state=42)
model=RandomForestClassifier()
model.fit(X_train,Y_train)
training_data_accuracy=accuracy_score(model.predict(X_train),Y_train)
# print(training_data_accuracy*100)
testing_data_accuracy=accuracy_score(model.predict(X_test),Y_test)
# print(testing_data_accuracy*100)
S = str(input("Enter the Equipment you want: "))

if(S=="Forceps"):
  print("Forceps available are 300")

elif(S=="Retractors"):
  print("Retractors available are 200")

elif(S=="Scissors"):
  print("Scissors available are 250")

elif(S=="Dissecting Forceps"):
  print("Dissecting Forceps available are 250")

elif(S=="Surgical Scissors"):
  print("Surgical Scissors available are 300")

elif(S=="Needle Holders"):
  print("Needle Holders available are 200")

elif(S=="Scalpel"):
  print("Scalpel available are 400")

elif(S=="Suction"):
  print("Suction available are 100")

elif(S=="Surgical Hooks"):
  print("Surgical Hooks available are 150")

elif(S=="Surgical Retractors"):
  print("Surgical Retractors available are 200")

elif(S=="Clamps"):
  print("Clamps available are 300")

elif(S=="Hemostats"):
  print("Hemostats available are 400")
else:
  print(S ,"is not available")
sns.set(style="whitegrid")
plt.figure(figsize=(12, 8))
sorted_data = df.sort_values(by="Equipment_Availability", ascending=False)
sns.barplot(x="Equipment_Availability", y="Equipment_Type", data=sorted_data, palette="Blues_r")

plt.title("Stock Availability of Medical Equipment", fontsize=16)
plt.xlabel("Equipment_Availability", fontsize=14)
plt.ylabel("Equipment_Type", fontsize=14)
plt.show()

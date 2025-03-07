import joblib
import pandas as pd
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# MongoDB Connection
MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["AarogyaSaarthi"]
collection = db["BloodBank"]

MODEL_PATH = "blood_demand_model.pkl"
ENCODER_PATH = "label_encoder.pkl"

def train_and_save_model():
    # Fetch data from MongoDB
    data = list(collection.find({}, {"_id": 0}))  # Exclude _id field
    dataset = pd.DataFrame(data)

    # **Handle missing or empty dataset**
    if dataset.empty:
        print("Error: No data found in the database.")
        return

    # **Ensure 'Types of blood' exists before encoding**
    if "Types of blood" not in dataset.columns:
        print("Error: 'Types of blood' field is missing in the dataset.")
        return

    # **Handle NaN values by filling with a default value (if necessary)**
    dataset.fillna(0, inplace=True)  # Replace NaN values with 0 (you can change this)

    # **Encode blood types**
    le = LabelEncoder()
    dataset["Types of blood"] = le.fit_transform(dataset["Types of blood"])

    # **Save the label encoder**
    joblib.dump(le, ENCODER_PATH)

    # **Define features and target**
    X = dataset[["Types of blood", "October", "November", "December", "January", "February"]]
    y = dataset["Output"]  # Convert to 1D array

    # **Split the data**
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # **Train the model**
    model = LinearRegression()
    model.fit(X_train, y_train)

    # **Save the model**
    joblib.dump(model, MODEL_PATH)
    print("Model trained and saved successfully.")

if __name__ == "__main__":
    train_and_save_model()

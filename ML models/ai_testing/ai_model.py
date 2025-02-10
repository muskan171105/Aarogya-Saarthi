import pandas as pd
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["hospitalDB"]
collection = db["patients"]  # Patient records stored here

# Define priority levels
admission_priority = {"Emergency": 3, "Urgent": 2, "Elective": 1}

def assign_priority(patient):
    """Calculate priority score for a patient."""
    priority = 0
    priority += admission_priority.get(patient.get("Admission Type", ""), 0) * 10
    if patient.get("Sepsis") == "Yes":
        priority += 15
    if patient.get("Heart Rate", 0) > 100 or patient.get("Heart Rate", 0) < 60:
        priority += 5
    if patient.get("Glucose", 0) > 140 or patient.get("Glucose", 0) < 70:
        priority += 5
    if patient.get("Potassium", 0) < 3.5 or patient.get("Potassium", 0) > 5.2:
        priority += 5
    if patient.get("Lactate", 0) > 2.0:
        priority += 5
    return priority

# Fetch data from MongoDB
patients = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB ObjectId

# Assign priority to each patient
for patient in patients:
    patient["Priority Score"] = assign_priority(patient)

# Convert to DataFrame for easier sorting & display
df = pd.DataFrame(patients)

# Sort patients by priority score in descending order
df_sorted = df.sort_values(by="Priority Score", ascending=False)

# Display top 100 high-priority patients
print(df_sorted[["Patient ID", "Name", "Medical Condition", "Admission Type", "Sepsis"]].head(100))

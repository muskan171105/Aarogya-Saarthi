import pandas as pd

# Load the dataset
file_path = "dummy_updated_with_values.xlsx"
df = pd.read_excel(file_path, sheet_name="Sheet1")

# Define priority levels for admission type
admission_priority = {"Emergency": 3, "Urgent": 2, "Elective": 1}

def assign_priority(row):
    priority = 0
    
    # Higher priority for more severe admission type
    priority += admission_priority.get(row["Admission Type"], 0) * 10
    
    # Sepsis patients get high priority
    if row["Sepsis"] == "Yes":
        priority += 15
    
    # Check vital signs (abnormal values increase priority)
    if row["Heart Rate"] > 100 or row["Heart Rate"] < 60:
        priority += 5
    if row["Glucose"] > 140 or row["Glucose"] < 70:
        priority += 5
    if row["Potassium"] < 3.5 or row["Potassium"] > 5.2:
        priority += 5
    if row["Lactate"] > 2.0:
        priority += 5
    
    return priority

# Assign priority to each patient
df["Priority Score"] = df.apply(assign_priority, axis=1)

# Sort patients by priority in descending order
df_sorted = df.sort_values(by="Priority Score", ascending=False)

# Display the top 10 high-priority patients
print(df_sorted[["Patient ID", "Name", "Medical Condition", "Admission Type", "Sepsis"]].head(100))
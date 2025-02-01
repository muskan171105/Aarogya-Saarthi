from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib  # If using a trained model
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# Load dataset (if needed)
dataset = pd.read_csv('bed_dataset.csv')

# Train model on full dataset
X = dataset[['October', 'November', 'December', 'January', 'February']]
y = dataset[['March', 'April', 'May', 'Combined']]

model = LinearRegression()
model.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json["input_data"]
        input_data = np.array(data).reshape(1, -1)
        prediction = model.predict(input_data)
        return jsonify({
            "March": int(prediction[0][0]),
            "April": int(prediction[0][1]),
            "May": int(prediction[0][2]),
            "Combined": int(prediction[0][3])
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

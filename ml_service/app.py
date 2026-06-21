from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

# Load model and scaler
try:
    model = joblib.load('models/model.pkl')
    scaler = joblib.load('models/scaler.pkl')
    print("✅ Model and scaler loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model/scaler: {e}")
    model, scaler = None, None

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML Service Running ✅'})

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        features = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
                    'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']

        input_data = [float(data[f]) for f in features]
        input_df = pd.DataFrame([input_data], columns=features)
        input_scaled = scaler.transform(input_df)

        prediction = model.predict(input_scaled)
        probability = model.predict_proba(input_scaled)[0][1] * 100

        result = "Positive for Diabetes" if prediction[0] == 1 else "Negative for Diabetes"

        return jsonify({
            'success': True,
            'prediction': result,
            'probability': f"{probability:.2f}%",
            'is_diabetic': bool(prediction[0] == 1)
        })

    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

# Load diabetes model and scaler
try:
    diabetes_model = joblib.load('models/model.pkl')
    diabetes_scaler = joblib.load('models/scaler.pkl')
    print("✅ Diabetes model and scaler loaded successfully.")
except Exception as e:
    print(f"❌ Error loading diabetes model/scaler: {e}")
    diabetes_model, diabetes_scaler = None, None

# Load heart model and scaler
try: 
    heart_model = joblib.load('models/heart_model.pkl')
    heart_scaler = joblib.load('models/heart_scaler.pkl')
    print("✅ Heart model and scaler loaded successfully.")
except Exception as e:
    print(f"❌ Error loading heart model/scaler: {e}")
    heart_model, heart_scaler = None, None

#health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML Service Running ✅'})

#diabetes prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    if diabetes_model is None or diabetes_scaler is None:
        return jsonify({'error': 'Diabetes model not loaded'}), 500

    try:
        data = request.json
        features = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
                    'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']

        input_data = [float(data[f]) for f in features]
        input_df = pd.DataFrame([input_data], columns=features)
        input_scaled = diabetes_scaler.transform(input_df)

        prediction = diabetes_model.predict(input_scaled)
        probability = diabetes_model.predict_proba(input_scaled)[0][1] * 100

        result = "Positive for Diabetes" if prediction[0] == 1 else "Negative for Diabetes"

        return jsonify({
            'success': True,
            'prediction': result,
            'probability': f"{probability:.2f}%",
            'is_diabetic': bool(prediction[0] == 1)
        })

    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500
    
#heart disease prediction endpoint
@app.route('/predict/heart',methods=['POST'])
def predict_heart():
    if heart_model is None or heart_scaler is None:
        return jsonify({'error':'Heart model not loaded'}), 500
    try:
        data = request.json
        features = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
        input_data = [float(data[f]) for f in features]
        input_df = pd.DataFrame([input_data], columns=features)
        input_scaled = heart_scaler.transform(input_df)

        prediction = heart_model.predict(input_scaled)
        probability = heart_model.predict_proba(input_scaled)[0][1] * 100

        result = "Positive for Heart Disease" if prediction[0] == 1 else "Negative for Heart Disease"

        return jsonify({
            'success': True,
            'prediction': result,
            'probability': f"{probability:.2f}%",
            'is_positive': bool(prediction[0] == 1)
        })

    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

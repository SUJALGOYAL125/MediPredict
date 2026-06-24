from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

# ============ LOAD DIABETES MODEL ============
try:
    diabetes_model = joblib.load('models/model.pkl')
    diabetes_scaler = joblib.load('models/scaler.pkl')
    print("✅ Diabetes model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading diabetes model: {e}")
    diabetes_model, diabetes_scaler = None, None

# ============ LOAD HEART MODEL ============
try:
    heart_model = joblib.load('models/heart_model.pkl')
    heart_scaler = joblib.load('models/heart_scaler.pkl')
    print("✅ Heart model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading heart model: {e}")
    heart_model, heart_scaler = None, None

# ============ LOAD KIDNEY MODEL ============
try:
    kidney_model = joblib.load('models/kidney_model.pkl')
    kidney_scaler = joblib.load('models/kidney_scaler.pkl')
    print("✅ Kidney model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading kidney model: {e}")
    kidney_model, kidney_scaler = None, None

# ============ LOAD CANCER MODEL ============
try:
    cancer_model = joblib.load('models/cancer_model.pkl')
    cancer_scaler = joblib.load('models/cancer_scaler.pkl')
    print("✅ Cancer model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading cancer model: {e}")
    cancer_model, cancer_scaler = None, None

# ============ HEALTH CHECK ============
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML Service Running ✅'})

# ============ DIABETES PREDICTION ============
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

# ============ HEART DISEASE PREDICTION ============
@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    if heart_model is None or heart_scaler is None:
        return jsonify({'error': 'Heart model not loaded'}), 500
    try:
        data = request.json
        features = ['age', 'sex', 'cp', 'trestbps', 'chol',
                    'fbs', 'restecg', 'thalach', 'exang',
                    'oldpeak', 'slope', 'ca', 'thal']
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

# ============ KIDNEY DISEASE PREDICTION ============
@app.route('/predict/kidney', methods=['POST'])
def predict_kidney():
    if kidney_model is None or kidney_scaler is None:
        return jsonify({'error': 'Kidney model not loaded'}), 500
    try:
        data = request.json
        features = ['age', 'bp', 'sg', 'al', 'su', 'rbc', 'pc',
                    'pcc', 'ba', 'bgr', 'bu', 'sc', 'sod', 'pot',
                    'hemo', 'pcv', 'wc', 'rc', 'htn', 'dm',
                    'cad', 'appet', 'pe', 'ane']
        input_data = [float(data[f]) for f in features]
        input_df = pd.DataFrame([input_data], columns=features)
        input_scaled = kidney_scaler.transform(input_df)
        prediction = kidney_model.predict(input_scaled)
        probability = kidney_model.predict_proba(input_scaled)[0][1] * 100
        result = "Positive for Kidney Disease" if prediction[0] == 1 else "Negative for Kidney Disease"
        return jsonify({
            'success': True,
            'prediction': result,
            'probability': f"{probability:.2f}%",
            'is_positive': bool(prediction[0] == 1)
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

# ============ BREAST CANCER PREDICTION ============
@app.route('/predict/cancer', methods=['POST'])
def predict_cancer():
    if cancer_model is None or cancer_scaler is None:
        return jsonify({'error': 'Cancer model not loaded'}), 500
    try:
        data = request.json
        features = [
            'mean radius', 'mean texture', 'mean perimeter', 'mean area',
            'mean smoothness', 'mean compactness', 'mean concavity',
            'mean concave points', 'mean symmetry', 'mean fractal dimension',
            'radius error', 'texture error', 'perimeter error', 'area error',
            'smoothness error', 'compactness error', 'concavity error',
            'concave points error', 'symmetry error', 'fractal dimension error',
            'worst radius', 'worst texture', 'worst perimeter', 'worst area',
            'worst smoothness', 'worst compactness', 'worst concavity',
            'worst concave points', 'worst symmetry', 'worst fractal dimension'
        ]
        input_data = [float(data[f]) for f in features]
        input_df = pd.DataFrame([input_data], columns=features)
        input_scaled = cancer_scaler.transform(input_df)
        prediction = cancer_model.predict(input_scaled)
        probability = cancer_model.predict_proba(input_scaled)[0][1] * 100
        result = "Malignant (Cancer Detected)" if prediction[0] == 0 else "Benign (No Cancer)"
        return jsonify({
            'success': True,
            'prediction': result,
            'probability': f"{probability:.2f}%",
            'is_positive': bool(prediction[0] == 0)
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
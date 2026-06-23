const express = require('express');
const router = express.Router();
const axios = require('axios');
const Prediction = require('../models/Prediction');

// ============ CONFIG ============
const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5001';

// ============ MIDDLEWARE ============
const isAuth = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login');
    next();
};

// GET Diabetes Page
router.get('/diabetes', isAuth, (req, res) => {
    res.render('diabetes', { userName: req.session.userName, result: null });
});

// POST Diabetes Prediction
router.post('/diabetes/predict', isAuth, async (req, res) => {
    try {
        const inputData = {
            Pregnancies: parseFloat(req.body.Pregnancies),
            Glucose: parseFloat(req.body.Glucose),
            BloodPressure: parseFloat(req.body.BloodPressure),
            SkinThickness: parseFloat(req.body.SkinThickness),
            Insulin: parseFloat(req.body.Insulin),
            BMI: parseFloat(req.body.BMI),
            DiabetesPedigreeFunction: parseFloat(req.body.DiabetesPedigreeFunction),
            Age: parseFloat(req.body.Age)
        };

        // ✅ Updated Flask URL
        const flaskResponse = await axios.post(`${FLASK_URL}/predict`, inputData, {
            headers: { 'Content-Type': 'application/json' }
        });

        const { prediction, probability, is_diabetic } = flaskResponse.data;

        await Prediction.create({
            userId: req.session.userId,
            disease: 'Diabetes',
            inputs: inputData,
            result: prediction,
            probability: probability,
            isDiabetic: is_diabetic
        });

        res.render('diabetes', {
            userName: req.session.userName,
            result: { prediction, probability, is_diabetic }
        });

    } catch (error) {
    console.error('Prediction error:', error.message);
    console.error('Flask URL:', FLASK_URL);
    console.error('Full error:', error.response?.data);
    res.render('diabetes', {
        userName: req.session.userName,
        result: { error: 'Prediction failed. Make sure ML service is running.' }
    });
}
});

// heart disease prediction route
router.get('/heart', isAuth, (req, res) => {
    res.render('heart', { userName: req.session.userName, result: null })
})

router.post('/heart/predict', isAuth, async (req, res) => {
    try {
        const inputData = {
            age: parseFloat(req.body.age),
            sex: parseFloat(req.body.sex),
            cp: parseFloat(req.body.cp),
            trestbps: parseFloat(req.body.trestbps),
            chol: parseFloat(req.body.chol),
            fbs: parseFloat(req.body.fbs),
            restecg: parseFloat(req.body.restecg),
            thalach: parseFloat(req.body.thalach),
            exang: parseFloat(req.body.exang),
            oldpeak: parseFloat(req.body.oldpeak),
            slope: parseFloat(req.body.slope),
            ca: parseFloat(req.body.ca),
            thal: parseFloat(req.body.thal)
        }

        const flaskResponse = await axios.post(`${FLASK_URL}/predict/heart`, inputData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
        })

        // ✅ Fixed variable name
        const { prediction, probability, is_positive } = flaskResponse.data

        await Prediction.create({
            userId: req.session.userId,
            disease: 'Heart Disease',
            inputs: inputData,
            result: prediction,
            probability: probability,
            isDiabetic: is_positive  // ✅ Fixed
        })

        res.render('heart', {
            userName: req.session.userName,  // ✅ Fixed
            result: { prediction, probability, is_positive }  // ✅ Fixed
        })

    } catch (error) {
        console.error('Heart Prediction error:', error.message)
        console.error('Flask URL:', FLASK_URL)
        console.error('Full error:', error.response?.data)
        res.render('heart', {
            userName: req.session.userName,  // ✅ Fixed
            result: { error: 'Prediction failed. Make sure ML service is running.' }
        })
    }
})



// GET History Page
router.get('/history', isAuth, async (req, res) => {
    try {
        const predictions = await Prediction.find({ userId: req.session.userId })
            .sort({ date: -1 });
        res.render('history', { userName: req.session.userName, predictions });
    } catch (error) {
        console.error('History error:', error);
        res.render('history', { userName: req.session.userName, predictions: [] });
    }
});

module.exports = router;
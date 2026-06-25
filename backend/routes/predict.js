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

// ============ DIABETES ============
router.get('/diabetes', isAuth, (req, res) => {
    res.render('diabetes', { userName: req.session.userName, result: null });
});

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

        const flaskResponse = await axios.post(`${FLASK_URL}/predict`, inputData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
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
        console.error('Diabetes error:', error.message);
        res.render('diabetes', {
            userName: req.session.userName,
            result: { error: 'Prediction failed. Make sure ML service is running.' }
        });
    }
});

// ============ HEART DISEASE ============
router.get('/heart', isAuth, (req, res) => {
    res.render('heart', { userName: req.session.userName, result: null });
});

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
        };

        const flaskResponse = await axios.post(`${FLASK_URL}/predict/heart`, inputData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
        });

        const { prediction, probability, is_positive } = flaskResponse.data;

        await Prediction.create({
            userId: req.session.userId,
            disease: 'Heart Disease',
            inputs: inputData,
            result: prediction,
            probability: probability,
            isDiabetic: is_positive
        });

        res.render('heart', {
            userName: req.session.userName,
            result: { prediction, probability, is_positive }
        });

    } catch (error) {
        console.error('Heart error:', error.message);
        res.render('heart', {
            userName: req.session.userName,
            result: { error: 'Prediction failed. Make sure ML service is running.' }
        });
    }
});

// ============ KIDNEY DISEASE ============
router.get('/kidney', isAuth, (req, res) => {
    res.render('kidney', { userName: req.session.userName, result: null });
});

router.post('/kidney/predict', isAuth, async (req, res) => {
    try {
        const inputData = {
            age: parseFloat(req.body.age),
            bp: parseFloat(req.body.bp),
            sg: parseFloat(req.body.sg),
            al: parseFloat(req.body.al),
            su: parseFloat(req.body.su),
            rbc: parseFloat(req.body.rbc),
            pc: parseFloat(req.body.pc),
            pcc: parseFloat(req.body.pcc),
            ba: parseFloat(req.body.ba),
            bgr: parseFloat(req.body.bgr),
            bu: parseFloat(req.body.bu),
            sc: parseFloat(req.body.sc),
            sod: parseFloat(req.body.sod),
            pot: parseFloat(req.body.pot),
            hemo: parseFloat(req.body.hemo),
            pcv: parseFloat(req.body.pcv),
            wbcc: parseFloat(req.body.wc),
            rbcc: parseFloat(req.body.rc),
            htn: parseFloat(req.body.htn),
            dm: parseFloat(req.body.dm),
            cad: parseFloat(req.body.cad),
            appet: parseFloat(req.body.appet),
            pe: parseFloat(req.body.pe),
            ane: parseFloat(req.body.ane)
        };

        const flaskResponse = await axios.post(`${FLASK_URL}/predict/kidney`, inputData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
        });

        const { prediction, probability, is_positive } = flaskResponse.data;

        await Prediction.create({
            userId: req.session.userId,
            disease: 'Kidney Disease',
            inputs: inputData,
            result: prediction,
            probability: probability,
            isDiabetic: is_positive
        });

        res.render('kidney', {
            userName: req.session.userName,
            result: { prediction, probability, is_positive }
        });

    } catch (error) {
        console.error('Kidney error:', error.message);
        res.render('kidney', {
            userName: req.session.userName,
            result: { error: 'Prediction failed. Make sure ML service is running.' }
        });
    }
});

// ============ BREAST CANCER ============
router.get('/cancer', isAuth, (req, res) => {
    res.render('cancer', { userName: req.session.userName, result: null });
});

router.post('/cancer/predict', isAuth, async (req, res) => {
    try {
        const inputData = {
            'mean radius': parseFloat(req.body.mean_radius),
            'mean texture': parseFloat(req.body.mean_texture),
            'mean perimeter': parseFloat(req.body.mean_perimeter),
            'mean area': parseFloat(req.body.mean_area),
            'mean smoothness': parseFloat(req.body.mean_smoothness),
            'mean compactness': parseFloat(req.body.mean_compactness),
            'mean concavity': parseFloat(req.body.mean_concavity),
            'mean concave points': parseFloat(req.body.mean_concave_points),
            'mean symmetry': parseFloat(req.body.mean_symmetry),
            'mean fractal dimension': parseFloat(req.body.mean_fractal_dimension),
            'radius error': parseFloat(req.body.radius_error),
            'texture error': parseFloat(req.body.texture_error),
            'perimeter error': parseFloat(req.body.perimeter_error),
            'area error': parseFloat(req.body.area_error),
            'smoothness error': parseFloat(req.body.smoothness_error),
            'compactness error': parseFloat(req.body.compactness_error),
            'concavity error': parseFloat(req.body.concavity_error),
            'concave points error': parseFloat(req.body.concave_points_error),
            'symmetry error': parseFloat(req.body.symmetry_error),
            'fractal dimension error': parseFloat(req.body.fractal_dimension_error),
            'worst radius': parseFloat(req.body.worst_radius),
            'worst texture': parseFloat(req.body.worst_texture),
            'worst perimeter': parseFloat(req.body.worst_perimeter),
            'worst area': parseFloat(req.body.worst_area),
            'worst smoothness': parseFloat(req.body.worst_smoothness),
            'worst compactness': parseFloat(req.body.worst_compactness),
            'worst concavity': parseFloat(req.body.worst_concavity),
            'worst concave points': parseFloat(req.body.worst_concave_points),
            'worst symmetry': parseFloat(req.body.worst_symmetry),
            'worst fractal dimension': parseFloat(req.body.worst_fractal_dimension)
        };

        const flaskResponse = await axios.post(`${FLASK_URL}/predict/cancer`, inputData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
        });

        const { prediction, probability, is_positive } = flaskResponse.data;

        await Prediction.create({
            userId: req.session.userId,
            disease: 'Breast Cancer',
            inputs: inputData,
            result: prediction,
            probability: probability,
            isDiabetic: is_positive
        });

        res.render('cancer', {
            userName: req.session.userName,
            result: { prediction, probability, is_positive }
        });

    } catch (error) {
        console.error('Cancer error:', error.message);
        res.render('cancer', {
            userName: req.session.userName,
            result: { error: 'Prediction failed. Make sure ML service is running.' }
        });
    }
});


// ============ PNEUMONIA ============
router.get('/pneumonia', isAuth, (req, res) => {
    res.render('pneumonia', { userName: req.session.userName, result: null });
});

router.post('/pneumonia/predict', isAuth, async (req, res) => {
    try {
        const { imageBase64 } = req.body;

        const flaskResponse = await axios.post(`${FLASK_URL}/predict/pneumonia`,
            { image: imageBase64 },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000
            }
        );

        const { prediction, probability, is_positive } = flaskResponse.data;

        await Prediction.create({
            userId: req.session.userId,
            disease: 'Pneumonia',
            inputs: { imageProvided: true },
            result: prediction,
            probability: probability,
            isDiabetic: is_positive
        });

        // ✅ Return JSON instead of render
        res.json({
            success: true,
            prediction,
            probability,
            is_positive
        });

    } catch (error) {
        console.error('Pneumonia error:', error.message);
        res.json({
            success: false,
            error: 'Prediction failed. Make sure ML service is running.'
        });
    }
});

// ============ HISTORY ============
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
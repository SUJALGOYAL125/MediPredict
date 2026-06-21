const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    disease: {
        type: String,
        required: true,
        default: 'Diabetes'
    },
    inputs: {
        Pregnancies: Number,
        Glucose: Number,
        BloodPressure: Number,
        SkinThickness: Number,
        Insulin: Number,
        BMI: Number,
        DiabetesPedigreeFunction: Number,
        Age: Number
    },
    result: {
        type: String,
        required: true
    },
    probability: {
        type: String,
        required: true
    },
    isDiabetic: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prediction', predictionSchema);

const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    image: { type: String, required: false }, // Optional image URL
    text: { type: String, required: true } // Option text
});

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [optionSchema] // Array of options
});

const QuestionnaireSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: [questionSchema],
    createdAt: { type: Date, default: Date.now }
});

const Questionnaire = mongoose.model('Questionnaire', QuestionnaireSchema);

module.exports = Questionnaire;

const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/Questionnaire');

// 📌 Create a new questionnaire
router.post('/create', async (req, res) => {
    try {
        const { title, questions } = req.body;

        if (!title || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ error: "Invalid input" });
        }

        const newQuestionnaire = new Questionnaire({ title, questions });
        await newQuestionnaire.save();

        res.status(201).json({ message: "Questionnaire created successfully", data: newQuestionnaire });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Get all questionnaires
router.get('/', async (req, res) => {
    try {
        const questionnaires = await Questionnaire.find();
        res.json(questionnaires);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Get a single questionnaire by ID
router.get('/:id', async (req, res) => {
    try {
        const questionnaire = await Questionnaire.findById(req.params.id);
        if (!questionnaire) {
            return res.status(404).json({ error: "Questionnaire not found" });
        }
        res.json(questionnaire);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Update a questionnaire
router.put('/:id', async (req, res) => {
    try {
        const updatedQuestionnaire = await Questionnaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedQuestionnaire) {
            return res.status(404).json({ error: "Questionnaire not found" });
        }
        res.json({ message: "Questionnaire updated", data: updatedQuestionnaire });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Delete a questionnaire
router.delete('/:id', async (req, res) => {
    try {
        const deletedQuestionnaire = await Questionnaire.findByIdAndDelete(req.params.id);
        if (!deletedQuestionnaire) {
            return res.status(404).json({ error: "Questionnaire not found" });
        }
        res.json({ message: "Questionnaire deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

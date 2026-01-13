
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enables cross-origin requests from your frontend
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ncaa_quiz';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Models
const QuestionSchema = new mongoose.Schema({
  trade: String,
  text: String,
  options: [{
    id: String,
    text: String
  }],
  correctAnswer: String,
  explanation: String,
  difficulty: String
});

const Question = mongoose.model('Question', QuestionSchema);

// API Routes

// GET all questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new question
app.post('/api/questions', async (req, res) => {
  const question = new Question({
    trade: req.body.trade,
    text: req.body.text,
    options: req.body.options,
    correctAnswer: req.body.correctAnswer,
    explanation: req.body.explanation,
    difficulty: req.body.difficulty
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (Update) a question
app.put('/api/questions/:id', async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a question
app.delete('/api/questions/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

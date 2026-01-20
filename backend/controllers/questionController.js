
const Question = require('../models/Question');

// @desc    Get all questions with pagination and filtering
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.trade) filter.trade = req.query.trade;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;

    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      questions,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (question) {
      const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      res.json(updatedQuestion);
    } else {
      res.status(404);
      throw new Error('Question not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (question) {
      await Question.findByIdAndDelete(req.params.id);
      res.json({ message: 'Question removed' });
    } else {
      res.status(404);
      throw new Error('Question not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
};

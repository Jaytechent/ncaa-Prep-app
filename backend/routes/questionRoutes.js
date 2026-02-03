
const express = require('express');
const router = express.Router();
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getQuestions)
  .post(protect, admin, createQuestion);

router.route('/:id')
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion);

module.exports = router;

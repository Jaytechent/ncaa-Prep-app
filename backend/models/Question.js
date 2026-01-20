
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  trade: { 
    type: String, 
    required: [true, 'Please add a trade category'],
    index: true
  },
  text: { 
    type: String, 
    required: [true, 'Please add question text'] 
  },
  options: [{
    id: { type: String, required: true },
    text: { type: String, required: true }
  }],
  correctAnswer: { 
    type: String, 
    required: [true, 'Please specify the correct answer ID'] 
  },
  explanation: { 
    type: String, 
    required: [true, 'Please add an explanation'] 
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Question', QuestionSchema);

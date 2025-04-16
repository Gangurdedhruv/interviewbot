import mongoose from 'mongoose';

const famousQuestionsSchema = new mongoose.Schema({
  Title: {
    type: [String],
    required: true
  },
  Question: {
    type: [String],
    required: true
  },
  Description: {
    type: [String], 
    required: true
  },
  Example: {
    type: [String],
    required: true
  },
  Constraint: {
    type: [String],
    default: []  },
  Difficulty: {
    type: [String],
    default: []
  },
}, 
{
  timestamps: true
});

const famousQuestions = mongoose.model('FamousInterviewQuestions', famousQuestionsSchema);

export default famousQuestions;

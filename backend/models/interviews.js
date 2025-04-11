import mongoose from 'mongoose';

const interviewResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  scores: {
    type: [Number], 
    required: true
  },
  keyConcepts: {
    type: [String],
    default: []
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);

export default InterviewResult;
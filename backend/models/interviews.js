import mongoose from 'mongoose';

const interviewResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillName: {
    type: String,
    required: true
  },
  score: {
    type: Number, 
    required: true
  },
  keywords: {
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
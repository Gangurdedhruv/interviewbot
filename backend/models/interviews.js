import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema

const interviewSchema = new mongoose.Schema({
    questions: {
        type: [String],
        required: true
    },
    answers: {
        type: [String],
        required: true
    },
    // result: {
    //     type: [String],
    //     required: true
    // },
    keywords: {
        type: [String],
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
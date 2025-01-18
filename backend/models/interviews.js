import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema

const interviewSchema = mongoose.Schema({
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
    interviwee: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

modules.exports = mongoose.model('Interview', interviewSchema);
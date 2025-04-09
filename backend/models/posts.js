import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    replies: {
        type: [ObjectId],
    },
    replycount: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
    },
    votes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
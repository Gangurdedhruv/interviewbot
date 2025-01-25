import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
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
        default: []
    }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
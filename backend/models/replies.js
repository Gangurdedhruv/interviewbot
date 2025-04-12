import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema

const replySchema = new mongoose.Schema({
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
    votes: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

export default mongoose.model('Reply', replySchema);
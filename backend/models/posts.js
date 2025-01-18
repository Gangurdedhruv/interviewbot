import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema

const postSchema = mongoose.Schema({
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
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    replies: {
        type: [ObjectId]
    }
}, {
    timestamps: true
});

modules.exports = mongoose.model('Post', postSchema);
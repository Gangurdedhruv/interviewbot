import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema

const replySchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

modules.exports = mongoose.model('Reply', replySchema);
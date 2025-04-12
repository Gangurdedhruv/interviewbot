import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema

const transacSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
    },
    // currency: {
    //     type: String,
    // },
    // description: {
    //     type: String,
    // },
    paymentId: {
        type: String
    },
    status: {
        type: String
    }

}, { timestamps: true });

export default mongoose.model('Transaction', transacSchema);
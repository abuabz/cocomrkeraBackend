const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal'],
        default: 'deposit',
        required: true
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Savings', savingsSchema);

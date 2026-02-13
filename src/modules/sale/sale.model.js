const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    saleDate: {
        type: Date,
        required: true
    },
    totalTrees: {
        type: Number,
        required: false
    },
    perTreeAmount: {
        type: Number,
        required: false
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: false
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    treesHarvested: [Number]
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

module.exports = mongoose.model('Sale', saleSchema);

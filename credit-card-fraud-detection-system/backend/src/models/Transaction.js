const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    merchant: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        default: 'default-user'
    },
    isFraud: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'pending'
    },
    fraudConfidence: {
        type: Number,
        default: 0
    },
    fraudProbability: {
        type: Number,
        default: 0
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
const Transaction = require('../models/Transaction');
const axios = require('axios');

class TransactionController {
    async createTransaction(req, res) {
        try {
            const transactionData = req.body;
            
            // Call ML API for fraud detection
            let fraudResult = { fraud: false, confidence: 0.5 };
            try {
                const mlResponse = await axios.post('http://ml-api:5000/predict', transactionData);
                fraudResult = mlResponse.data;
            } catch (mlError) {
                console.error('ML API error:', mlError.message);
                // Continue with transaction creation even if ML API fails
            }
            
            // Add fraud detection results to transaction data
            const transactionWithFraud = {
                ...transactionData,
                isFraud: fraudResult.fraud,
                fraudConfidence: fraudResult.confidence,
                fraudProbability: fraudResult.fraud_probability || 0,
                status: fraudResult.fraud ? 'flagged' : 'approved'
            };
            
            const newTransaction = await Transaction.create(transactionWithFraud);
            
            res.status(201).json({
                ...newTransaction.toObject(),
                fraudDetection: {
                    isFraud: fraudResult.fraud,
                    confidence: fraudResult.confidence,
                    probability: fraudResult.fraud_probability || 0
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error creating transaction', error: error.message });
        }
    }

    async getTransactions(req, res) {
        try {
            // Logic to get all transactions
            const transactions = await Transaction.find();
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching transactions', error });
        }
    }
}

module.exports = TransactionController;
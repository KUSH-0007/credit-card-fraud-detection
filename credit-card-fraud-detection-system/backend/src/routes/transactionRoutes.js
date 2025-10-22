const express = require('express');
const TransactionController = require('../controllers/transactionController');

const router = express.Router();
const transactionController = new TransactionController();

function setRoutes(app) {
    router.post('/transactions', transactionController.createTransaction.bind(transactionController));
    router.get('/transactions', transactionController.getTransactions.bind(transactionController));

    app.use('/api', router);
}

module.exports = setRoutes;
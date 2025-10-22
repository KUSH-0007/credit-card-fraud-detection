import axios from 'axios';

// Use localhost for browser access, backend for Docker internal access
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5002/api/transactions'
    : 'http://backend:5000/api/transactions';

export const createTransaction = async (transactionData) => {
    try {
        const response = await axios.post(API_URL, transactionData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating transaction: ' + error.message);
    }
};

export const fetchTransactions = async () => {
    try {
        console.log('Fetching transactions from:', API_URL);
        const response = await axios.get(API_URL);
        console.log('Transactions fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Error fetching transactions: ' + error.message);
    }
};
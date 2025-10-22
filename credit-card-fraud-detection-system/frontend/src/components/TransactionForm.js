import React, { useState } from 'react';
import { createTransaction } from '../services/api';
import { CreditCard, DollarSign, Calendar, Store, AlertCircle, CheckCircle } from 'lucide-react';

const TransactionForm = () => {
    const [amount, setAmount] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [merchant, setMerchant] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const transactionData = {
            amount: parseFloat(amount),
            cardNumber,
            transactionDate: new Date(transactionDate).toISOString(),
            merchant,
        };

        try {
            const result = await createTransaction(transactionData);
            if (result.fraudDetection && result.fraudDetection.isFraud) {
                setSuccess(`Transaction submitted but flagged as potentially fraudulent (${(result.fraudDetection.confidence * 100).toFixed(1)}% confidence). Please review.`);
            } else {
                setSuccess('Transaction submitted and approved successfully!');
            }
            setAmount('');
            setCardNumber('');
            setTransactionDate('');
            setMerchant('');
        } catch (err) {
            setError('Failed to submit transaction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ml-64 min-h-screen bg-slate-50">
            <div className="p-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">New Transaction</h1>
                        <p className="text-slate-600">Submit a new transaction for fraud analysis</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="p-8">
                            {error && (
                                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                </div>
                            )}
                            
                            {success && (
                                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <p className="text-green-700">{success}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <DollarSign className="w-4 h-4 inline mr-2" />
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>

                                    {/* Card Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <CreditCard className="w-4 h-4 inline mr-2" />
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Transaction Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-2" />
                                            Transaction Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={transactionDate}
                                            onChange={(e) => setTransactionDate(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                                            required
                                        />
                                    </div>

                                    {/* Merchant */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Store className="w-4 h-4 inline mr-2" />
                                            Merchant
                                        </label>
                                        <input
                                            type="text"
                                            value={merchant}
                                            onChange={(e) => setMerchant(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                                            placeholder="Merchant name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-6 rounded-lg font-medium hover:from-teal-700 hover:to-teal-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            'Submit Transaction'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="mt-8 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">Fraud Detection Process</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                <span>Real-time ML analysis</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                <span>Risk scoring & confidence</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                <span>Instant decision making</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionForm;
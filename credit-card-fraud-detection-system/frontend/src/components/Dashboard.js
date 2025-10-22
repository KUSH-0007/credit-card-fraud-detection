import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../services/api';
import KPICard from './KPICard';
import FraudTrendChart from './FraudTrendChart';
import { 
  CreditCard, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const data = await fetchTransactions();
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, []);

    // Calculate KPIs
    const totalTransactions = transactions.length;
    const fraudTransactions = transactions.filter(t => t.isFraud).length;
    const approvedTransactions = transactions.filter(t => t.status === 'approved').length;
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
    const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const fraudRate = totalTransactions > 0 ? ((fraudTransactions / totalTransactions) * 100).toFixed(1) : 0;

    if (loading) {
        return (
            <div className="ml-64 p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ml-64 p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-900">Error Loading Data</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ml-64 min-h-screen bg-slate-50">
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
                    <p className="text-slate-600">Monitor fraud detection and transaction analytics</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        title="Total Transactions"
                        value={totalTransactions.toLocaleString()}
                        change="+12.5%"
                        changeType="positive"
                        icon={CreditCard}
                        color="blue"
                    />
                    <KPICard
                        title="Fraud Detected"
                        value={fraudTransactions}
                        change={`${fraudRate}%`}
                        changeType={fraudRate > 10 ? "negative" : "positive"}
                        icon={Shield}
                        color="red"
                    />
                    <KPICard
                        title="Approved"
                        value={approvedTransactions}
                        change="+8.2%"
                        changeType="positive"
                        icon={CheckCircle}
                        color="green"
                    />
                    <KPICard
                        title="Total Volume"
                        value={`$${totalAmount.toLocaleString()}`}
                        change="+15.3%"
                        changeType="positive"
                        icon={DollarSign}
                        color="purple"
                    />
                </div>

                {/* Chart */}
                <div className="mb-8">
                    <FraudTrendChart data={transactions} />
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
                                <p className="text-sm text-slate-600">Latest transaction activity</p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                                <Clock className="w-4 h-4" />
                                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Transaction
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Risk Level
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Confidence
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {transactions.slice(0, 10).map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-slate-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-3 ${
                                                    transaction.isFraud ? 'bg-red-500' : 'bg-green-500'
                                                }`}></div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {transaction.merchant}
                                                    </div>
                                                    <div className="text-sm text-slate-500">
                                                        ****{transaction.cardNumber?.slice(-4)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-slate-900">
                                                ${transaction.amount?.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(transaction.transactionDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                transaction.status === 'flagged' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : transaction.status === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                transaction.isFraud 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {transaction.isFraud ? 'High Risk' : 'Low Risk'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {transaction.fraudConfidence 
                                                ? `${(transaction.fraudConfidence * 100).toFixed(1)}%` 
                                                : 'N/A'
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {transactions.length === 0 && (
                        <div className="text-center py-12">
                            <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No transactions yet</h3>
                            <p className="text-slate-500">Transactions will appear here once they are processed.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';

function App() {
  return (
    <Router>
      <div className="App bg-slate-50 min-h-screen">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionForm />} />
          <Route path="/add-transaction" element={<TransactionForm />} />
          <Route path="/fraud-analysis" element={<Dashboard />} />
          <Route path="/trends" element={<Dashboard />} />
          <Route path="/reports" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
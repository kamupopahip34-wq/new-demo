
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Shield, AlertCircle } from 'lucide-react';
import { SubmissionStatus, WithdrawalStatus } from '../types';

export const Wallet: React.FC = () => {
  const { currentUser, withdrawals, submissions, currency, requestWithdrawal } = useApp();
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState<'BEP20' | 'TRC20'>('BEP20');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const err = requestWithdrawal(Number(amount), network, address);
    if (err) {
      setError(err);
    } else {
      setAmount('');
      setAddress('');
      alert('Withdrawal request submitted!');
    }
  };

  const userWithdrawals = withdrawals.filter(w => w.userId === currentUser?.id);
  const earnings = submissions
    .filter(s => s.userId === currentUser?.id && s.status === SubmissionStatus.APPROVED)
    .map(s => ({
      id: s.id,
      type: 'EARNING',
      title: s.taskTitle,
      amount: s.reward,
      status: 'APPROVED',
      date: s.submittedAt
    }));

  const transactions = [
    ...earnings,
    ...userWithdrawals.map(w => ({
      id: w.id,
      type: 'WITHDRAWAL',
      title: `${w.network} Payout`,
      amount: -w.amount,
      status: w.status,
      date: w.requestedAt
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Wallet Summary & Withdrawal Form */}
      <div className="lg:col-span-1 space-y-6">
        <div className="rounded-3xl gradient-bg p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <WalletIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
            </div>
            <h2 className="text-4xl font-black mb-6">{currency.symbol}{currentUser?.balance.toFixed(2)}</h2>
            <div className="flex gap-4">
              <div className="bg-white/10 p-3 rounded-2xl flex-1 border border-white/20">
                <p className="text-[10px] uppercase font-bold opacity-60">Total Earned</p>
                <p className="text-lg font-bold">{currency.symbol}{earnings.reduce((a, b) => a + b.amount, 0).toFixed(2)}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl flex-1 border border-white/20">
                <p className="text-[10px] uppercase font-bold opacity-60">Withdrawn</p>
                <p className="text-lg font-bold">{currency.symbol}{userWithdrawals.filter(w => w.status === WithdrawalStatus.APPROVED).reduce((a, b) => a + b.amount, 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <form onSubmit={handleWithdraw} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            Withdraw Funds
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Amount ({currency.code})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">{currency.symbol}</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="1"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Network</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onClick={() => setNetwork('BEP20')}
                  className={`py-3 rounded-xl text-sm font-bold border transition-all ${network === 'BEP20' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700'}`}
                >
                  BEP20 (BNB)
                </button>
                <button 
                  type="button"
                  onClick={() => setNetwork('TRC20')}
                  className={`py-3 rounded-xl text-sm font-bold border transition-all ${network === 'TRC20' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700'}`}
                >
                  TRC20 (Tron)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Wallet Address</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x... or T..."
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-xl text-[10px]">
                <Shield className="w-4 h-4 shrink-0" />
                Requests are processed within 24-48 hours. Please double-check your wallet address.
              </div>
              <button 
                type="submit"
                className="w-full py-4 rounded-xl gradient-bg text-white font-bold hover:shadow-lg transition-all"
              >
                Request Withdrawal
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Transaction History */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-xl font-bold flex items-center justify-between">
          Transaction History
          <span className="text-sm font-normal text-gray-400">{transactions.length} items</span>
        </h3>
        
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl flex items-center justify-between group hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'EARNING' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                  {tx.type === 'EARNING' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold group-hover:text-indigo-600 transition-colors">{tx.title}</h4>
                  <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount > 0 ? '+' : ''}{currency.symbol}{Math.abs(tx.amount).toFixed(2)}
                </p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                  tx.status === 'APPROVED' ? 'text-green-500' : 
                  tx.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-400 italic">No transactions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WithdrawalStatus, WithdrawalRequest } from '../types';
import { 
  DollarSign, CheckSquare, XCircle, Search, Filter, 
  ChevronDown, Wallet, ExternalLink, AlertTriangle
} from 'lucide-react';

export const AdminWithdrawals: React.FC = () => {
  const { withdrawals, reviewWithdrawal, currency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');

  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = w.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         w.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f0f9ff] to-[#e0f2fe] p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-600 rounded-3xl shadow-[0_10px_0_rgb(6,95,70)] rotate-3">
              <DollarSign className="text-white w-8 h-8" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-md">
              PAYOUT <span className="text-emerald-600">COMMAND</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold ml-1 opacity-70 italic">Oversee network liquidity and agent settlements.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3.5rem] border-b-[14px] border-slate-200 dark:border-slate-900 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
          <input 
            type="text" 
            placeholder="Search wallet address or agent email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-emerald-500/40 focus:ring-8 focus:ring-emerald-500/5 text-lg font-bold transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-16 pr-12 py-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-emerald-500/40 text-lg font-black appearance-none cursor-pointer shadow-inner"
            >
              <option value="ALL">ALL WITHDRAWALS</option>
              <option value="PENDING">⏳ PENDING</option>
              <option value="APPROVED">💎 APPROVED</option>
              <option value="REJECTED">🚫 REJECTED</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[4rem] border-b-[20px] border-slate-200 dark:border-slate-900 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-400 text-xs uppercase font-black tracking-[0.2em] border-b-4 border-slate-100 dark:border-slate-700">
                <th className="px-10 py-8">Agent Email</th>
                <th className="px-8 py-8">Wallet Network</th>
                <th className="px-8 py-8 text-center">Amount</th>
                <th className="px-8 py-8 text-center">Status</th>
                <th className="px-10 py-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-slate-50 dark:divide-slate-700/50">
              {filteredWithdrawals.map(req => (
                <tr key={req.id} className="group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all duration-300">
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 dark:text-white text-lg">{req.userEmail}</span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(req.requestedAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl text-white font-black text-[10px] ${req.network === 'BEP20' ? 'bg-yellow-500 shadow-[0_4px_0_rgb(180,83,9)]' : 'bg-red-500 shadow-[0_4px_0_rgb(153,27,27)]'}`}>
                        {req.network}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-black text-slate-500 flex items-center gap-1 group/addr">
                          {req.address.substring(0, 10)}...{req.address.substring(req.address.length - 4)}
                          <ExternalLink className="w-3 h-3 cursor-pointer hover:text-indigo-500" />
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className="font-black text-2xl text-emerald-600 drop-shadow-sm">{currency.symbol}{req.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className={`inline-block px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-tighter shadow-sm ${
                      req.status === WithdrawalStatus.PENDING ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                      req.status === WithdrawalStatus.APPROVED ? 'bg-emerald-600 text-white shadow-[0_4px_0_rgb(6,95,70)]' :
                      'bg-rose-500 text-white shadow-[0_4px_0_rgb(159,18,57)]'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {req.status === WithdrawalStatus.PENDING ? (
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => reviewWithdrawal(req.id, WithdrawalStatus.REJECTED)}
                          className="p-4 bg-white dark:bg-slate-700 text-rose-500 hover:text-white hover:bg-rose-500 rounded-2xl shadow-xl transition-all border-b-4 border-rose-50 dark:border-slate-900"
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => reviewWithdrawal(req.id, WithdrawalStatus.APPROVED)}
                          className="p-4 bg-white dark:bg-slate-700 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-2xl shadow-xl transition-all border-b-4 border-emerald-50 dark:border-slate-900"
                        >
                          <CheckSquare className="w-6 h-6" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-slate-300 uppercase italic">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredWithdrawals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="w-32 h-32 bg-emerald-50 dark:bg-emerald-900/20 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner">
                        <Wallet className="w-16 h-16 text-emerald-400" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Vault Is Synchronized</h3>
                      <p className="text-slate-500 font-bold text-lg opacity-60">No pending payout requests at this time.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[3rem] border-2 border-amber-100 dark:border-amber-900 flex items-center gap-6 shadow-sm">
        <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-black text-amber-800 dark:text-amber-200 text-xl uppercase tracking-tighter">Refund Policy Reminder</h4>
          <p className="text-amber-700 dark:text-amber-400 font-bold italic opacity-80">Rejecting a withdrawal automatically restores the requested amount to the agent's balance.</p>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, DollarSign, List, Save, ShieldCheck, 
  Terminal, Database, Globe, RefreshCcw, Bell
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { currency, updateCurrency, logs, addLog } = useApp();
  const [currencySymbol, setCurrencySymbol] = useState(currency.symbol);
  const [currencyCode, setCurrencyCode] = useState(currency.code);

  const handleCurrencyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrency(currencySymbol, currencyCode);
    alert('System currency updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-800 rounded-3xl shadow-[0_10px_0_rgb(15,23,42)] rotate-3">
              <Settings className="text-white w-8 h-8" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-md">
              CORE <span className="text-slate-800">CONFIG</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold ml-1 opacity-70 italic">Synchronize global parameters and audit system logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Currency Settings */}
        <div className="xl:col-span-1 space-y-10">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[4rem] border-b-[20px] border-slate-200 dark:border-slate-900 shadow-2xl space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Global Currency</h3>
                <p className="text-slate-500 font-bold opacity-70 text-sm">Define universal reward unit.</p>
              </div>
            </div>

            <form onSubmit={handleCurrencyUpdate} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block ml-1">Symbol (e.g., $)</label>
                <input 
                  type="text" 
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-indigo-500 font-black text-3xl shadow-inner text-center"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block ml-1">ISO Code (e.g., USD)</label>
                <input 
                  type="text" 
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-indigo-500 font-black text-3xl shadow-inner text-center uppercase"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-6 gradient-bg text-white rounded-[2.5rem] font-black text-lg shadow-[0_12px_30px_-10px_rgba(79,70,229,0.5)] transition-all hover:-translate-y-2 border-b-8 border-indigo-900 active:translate-y-2 active:shadow-none flex items-center justify-center gap-3"
              >
                <Save className="w-6 h-6" /> SAVE PARAMS
              </button>
            </form>
          </div>

          <div className="bg-emerald-500 text-white p-10 rounded-[4rem] shadow-xl border-b-8 border-emerald-900 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <ShieldCheck className="w-12 h-12" />
              <h4 className="text-2xl font-black uppercase tracking-tighter">System Integrity</h4>
              <p className="font-bold opacity-80">All core modules are currently operating within normal parameters.</p>
              <button onClick={() => addLog('Manual system health check initiated')} className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-2">
                <RefreshCcw className="w-4 h-4" /> RE-VERIFY CORE
              </button>
            </div>
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* System Logs */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Audit Trail</h3>
            </div>
            <span className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-xl text-xs font-black text-slate-500 uppercase">{logs.length} RECORDS</span>
          </div>

          <div className="bg-slate-900 text-slate-300 rounded-[3.5rem] p-10 border-b-[20px] border-slate-950 shadow-2xl overflow-hidden font-mono text-sm space-y-4 max-h-[800px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 border-b border-slate-800 pb-4 group hover:bg-slate-800/50 p-2 rounded-xl transition-colors">
                <span className="text-indigo-500 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={`shrink-0 font-black ${
                  log.type === 'ERROR' ? 'text-rose-500' : 
                  log.type === 'WARNING' ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {log.type}
                </span>
                <span className="text-slate-500 shrink-0 italic">@{log.user.split('@')[0]}</span>
                <span className="text-slate-100 group-hover:text-indigo-300 transition-colors">{log.action}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-20 text-slate-600 italic">
                <Database className="w-16 h-16 mx-auto mb-6 opacity-20" />
                INITIATING LOG STREAM...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

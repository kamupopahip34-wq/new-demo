
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubmissionStatus, TaskSubmission } from '../types';
import { 
  CheckCircle, XCircle, Eye, Search, Filter, 
  ChevronDown, Clock, ShieldCheck, AlertCircle,
  Maximize2, Image as ImageIcon
} from 'lucide-react';

export const AdminRequests: React.FC = () => {
  const { submissions, reviewSubmission, currency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.taskTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReview = (id: string, status: SubmissionStatus) => {
    reviewSubmission(id, status, adminNote);
    setSelectedSubmission(null);
    setAdminNote('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-500 rounded-3xl shadow-[0_10px_0_rgb(180,83,9)] -rotate-3">
              <Clock className="text-white w-8 h-8" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-md">
              REVIEW <span className="text-amber-500">CENTER</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold ml-1 opacity-70 italic">Verify proof of completion and release rewards.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3.5rem] border-b-[14px] border-slate-200 dark:border-slate-900 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-amber-500" />
          <input 
            type="text" 
            placeholder="Search agents or missions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-amber-500/40 focus:ring-8 focus:ring-amber-500/5 text-lg font-bold transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-amber-500" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-16 pr-12 py-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-amber-500/40 text-lg font-black appearance-none cursor-pointer shadow-inner"
            >
              <option value="ALL">ALL REQUESTS</option>
              <option value="PENDING">🕒 PENDING</option>
              <option value="APPROVED">✅ APPROVED</option>
              <option value="REJECTED">❌ REJECTED</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[4rem] border-b-[20px] border-slate-200 dark:border-slate-900 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-400 text-xs uppercase font-black tracking-[0.2em] border-b-4 border-slate-100 dark:border-slate-700">
                <th className="px-10 py-8">Agent Identity</th>
                <th className="px-8 py-8">Mission Target</th>
                <th className="px-8 py-8 text-center">Bounty</th>
                <th className="px-8 py-8 text-center">Status</th>
                <th className="px-10 py-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-slate-50 dark:divide-slate-700/50">
              {filteredSubmissions.map(sub => (
                <tr key={sub.id} className="group hover:bg-amber-50/40 dark:hover:bg-amber-900/10 transition-all duration-300">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-black text-slate-400 border-2 border-white dark:border-slate-800 shadow-sm">
                        {sub.userEmail[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 dark:text-white text-lg">{sub.userEmail}</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{new Date(sub.submittedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 font-black text-slate-700 dark:text-slate-300 italic">
                    {sub.taskTitle}
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className="font-black text-2xl text-emerald-600 tabular-nums drop-shadow-sm">{currency.symbol}{sub.reward.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className={`inline-block px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm ${
                      sub.status === SubmissionStatus.PENDING ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                      sub.status === SubmissionStatus.APPROVED ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                      'bg-rose-100 text-rose-600 border border-rose-200'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => setSelectedSubmission(sub)}
                      className="p-4 bg-white dark:bg-slate-700 text-amber-500 hover:text-white hover:bg-amber-500 rounded-[1.5rem] shadow-xl transition-all border-b-4 border-amber-100 dark:border-slate-900 hover:border-amber-800 active:border-0 active:translate-y-1"
                    >
                      <Eye className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="w-32 h-32 bg-amber-50 dark:bg-amber-900/20 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner rotate-12">
                        <ShieldCheck className="w-16 h-16 text-amber-400" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Queue Is Clear</h3>
                      <p className="text-slate-500 font-bold text-lg opacity-60">All mission reports have been processed.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[4rem] p-12 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border-b-[24px] border-slate-200 dark:border-slate-900 overflow-y-auto max-h-[92vh] border-t-8 border-amber-500">
            <button 
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-10 right-10 p-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-3xl transition-all shadow-sm"
            >
              <XCircle className="w-8 h-8 font-black text-slate-400 hover:text-rose-500" />
            </button>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left: Intelligence Proof */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mission Proof</h2>
                    <p className="text-slate-500 font-bold opacity-70 italic">Visual verification from agent.</p>
                  </div>
                </div>

                <div className="relative group rounded-[2.5rem] overflow-hidden border-8 border-slate-100 dark:border-slate-900 shadow-inner group">
                  <img 
                    src={selectedSubmission.proofImage} 
                    alt="Proof" 
                    className="w-full h-auto object-contain max-h-[500px] cursor-zoom-in"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white p-4 rounded-full text-slate-900 font-black flex items-center gap-2 shadow-2xl">
                      <Maximize2 className="w-5 h-5" /> View Original
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Decision Panel */}
              <div className="w-full lg:w-96 space-y-10">
                <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border-b-8 border-slate-200 dark:border-slate-900 space-y-6">
                  <div>
                    <label className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-3 block">Agent Details</label>
                    <p className="font-black text-slate-900 dark:text-white text-xl truncate">{selectedSubmission.userEmail}</p>
                  </div>
                  <div>
                    <label className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-3 block">Mission Objective</label>
                    <p className="font-bold text-slate-600 dark:text-slate-400 italic text-lg">{selectedSubmission.taskTitle}</p>
                  </div>
                  <div>
                    <label className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-3 block">Expected Bounty</label>
                    <p className="font-black text-emerald-500 text-3xl">{currency.symbol}{selectedSubmission.reward.toFixed(2)}</p>
                  </div>
                </div>

                {selectedSubmission.status === SubmissionStatus.PENDING ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-3 block ml-1">Internal Review Note</label>
                      <textarea 
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Add reason for approval/rejection..."
                        className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border-4 border-transparent outline-none focus:border-amber-500 font-bold text-sm shadow-inner resize-none h-32"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <button 
                        onClick={() => handleReview(selectedSubmission.id, SubmissionStatus.REJECTED)}
                        className="py-6 bg-rose-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_8px_0_rgb(159,18,57)] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_rgb(159,18,57)] active:translate-y-2 active:shadow-none"
                      >
                        REJECT
                      </button>
                      <button 
                        onClick={() => handleReview(selectedSubmission.id, SubmissionStatus.APPROVED)}
                        className="py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_8px_0_rgb(6,95,70)] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_rgb(6,95,70)] active:translate-y-2 active:shadow-none"
                      >
                        APPROVE
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`p-8 rounded-[2.5rem] border-b-8 flex flex-col items-center justify-center text-center gap-4 ${
                    selectedSubmission.status === SubmissionStatus.APPROVED ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'
                  }`}>
                    {selectedSubmission.status === SubmissionStatus.APPROVED ? <CheckCircle className="w-16 h-16" /> : <AlertCircle className="w-16 h-16" />}
                    <div>
                      <p className="text-2xl font-black uppercase tracking-widest">{selectedSubmission.status}</p>
                      {selectedSubmission.adminNote && <p className="mt-2 font-bold italic opacity-70">"{selectedSubmission.adminNote}"</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { useApp } from '../context/AppContext';
import { SubmissionStatus } from '../types';
import { Clock, CheckCircle, XCircle, AlertCircle, ExternalLink, Calendar } from 'lucide-react';

export const UserRequests: React.FC = () => {
  const { submissions, currentUser, currency } = useApp();

  const userSubmissions = submissions
    .filter(s => s.userId === currentUser?.id)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">My Task Requests</h1>
        <p className="text-gray-500 text-sm">Track the status of your submitted task proofs.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {userSubmissions.map(sub => (
          <div 
            key={sub.id} 
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-5">
              <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-sm ${
                sub.status === SubmissionStatus.PENDING ? 'bg-amber-100 text-amber-600' :
                sub.status === SubmissionStatus.APPROVED ? 'bg-emerald-100 text-emerald-600' :
                'bg-rose-100 text-rose-600'
              }`}>
                {sub.status === SubmissionStatus.PENDING && <Clock className="w-7 h-7" />}
                {sub.status === SubmissionStatus.APPROVED && <CheckCircle className="w-7 h-7" />}
                {sub.status === SubmissionStatus.REJECTED && <XCircle className="w-7 h-7" />}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{sub.taskTitle}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                    sub.status === SubmissionStatus.PENDING ? 'bg-amber-50 text-amber-600' :
                    sub.status === SubmissionStatus.APPROVED ? 'bg-emerald-50 text-emerald-600' :
                    'bg-rose-50 text-rose-600'
                  }`}>
                    {sub.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(sub.submittedAt).toLocaleDateString()}</span>
                  <span className="text-emerald-600 font-bold">Reward: {currency.symbol}{sub.reward.toFixed(2)}</span>
                </div>
                {sub.adminNote && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">Feedback from Admin</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{sub.adminNote}"</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Proof Submitted</p>
                  <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 justify-end">
                    View Screenshot <ExternalLink className="w-3 h-3" />
                  </button>
               </div>
               <img 
                src={sub.proofImage} 
                alt="Proof" 
                className="w-12 h-12 rounded-xl object-cover border-2 border-gray-50 shadow-sm cursor-pointer hover:scale-110 transition-transform" 
               />
            </div>
          </div>
        ))}

        {userSubmissions.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-400">No submissions yet</h3>
            <p className="text-sm text-gray-500 mt-2">Pick an active task and submit your first proof!</p>
            <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
              Go to Tasks
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

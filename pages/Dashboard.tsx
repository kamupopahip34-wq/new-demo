
import React from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus, SubmissionStatus } from '../types';
import { useNavigate } from 'react-router-dom';
// Fix: Added ListTodo to the imports from lucide-react
import { TrendingUp, CheckCircle2, AlertCircle, ArrowRight, ListTodo } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, tasks, submissions, currency } = useApp();
  const navigate = useNavigate();

  const activeTasks = tasks.filter(t => t.status === TaskStatus.PUBLISHED);
  const pendingSubmissions = submissions.filter(s => s.userId === currentUser?.id && s.status === SubmissionStatus.PENDING);
  const approvedSubmissions = submissions.filter(s => s.userId === currentUser?.id && s.status === SubmissionStatus.APPROVED);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl gradient-bg p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.email.split('@')[0]}!</h1>
          <p className="opacity-80 max-w-md">Start completing micro-tasks today and earn real rewards. Your contribution matters!</p>
          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => navigate('/tasks')}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              Start Earning <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
          <p className="text-2xl font-bold">{currency.symbol}{currentUser?.balance.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Approved Tasks</p>
          <p className="text-2xl font-bold">{approvedSubmissions.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Review</p>
          <p className="text-2xl font-bold">{pendingSubmissions.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <ListTodo className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Available Tasks</p>
          <p className="text-2xl font-bold">{activeTasks.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Latest Tasks</h2>
            <button onClick={() => navigate('/tasks')} className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">View all</button>
          </div>
          <div className="space-y-4">
            {activeTasks.slice(0, 3).map(task => (
              <div 
                key={task.id} 
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
                onClick={() => navigate(`/tasks`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-400">
                    {task.title[0]}
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                    <p className="text-xs text-gray-500">{task.quantity - task.completedCount} spots left</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+{currency.symbol}{task.reward.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400">Immediate Reward</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Feed */}
        <section>
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 overflow-hidden">
            {submissions.filter(s => s.userId === currentUser?.id).length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No activity yet. Start a task!</p>
              </div>
            ) : (
              <div className="space-y-6 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
                {submissions.filter(s => s.userId === currentUser?.id).slice(0, 4).map(sub => (
                  <div key={sub.id} className="relative pl-8">
                    <div className={`absolute left-0 top-1 w-[24px] h-[24px] rounded-full border-4 border-white dark:border-gray-800 z-10 flex items-center justify-center ${
                      sub.status === SubmissionStatus.APPROVED ? 'bg-green-500' : 
                      sub.status === SubmissionStatus.REJECTED ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-semibold">{sub.taskTitle}</p>
                      <p className="text-xs text-gray-500">{sub.status} • {new Date(sub.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

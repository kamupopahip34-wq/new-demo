
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Users, ListTodo, Wallet, ShieldAlert, 
  ArrowUpRight, ArrowDownRight, Sparkles 
} from 'lucide-react';
import { analyzeDashboard } from '../services/geminiService';
import { SubmissionStatus, WithdrawalStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const { users, tasks, submissions, withdrawals, currency } = useApp();
  const [analysis, setAnalysis] = useState<{ summary: string, suggestions: string[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalEarnings = submissions
    .filter(s => s.status === SubmissionStatus.APPROVED)
    .reduce((acc, s) => acc + s.reward, 0);
  
  const pendingWithdrawals = withdrawals.filter(w => w.status === WithdrawalStatus.PENDING).length;
  const pendingTasks = submissions.filter(s => s.status === SubmissionStatus.PENDING).length;

  const chartData = [
    { name: 'Mon', users: 12, earnings: 45 },
    { name: 'Tue', users: 19, earnings: 78 },
    { name: 'Wed', users: 15, earnings: 60 },
    { name: 'Thu', users: 22, earnings: 110 },
    { name: 'Fri', users: 30, earnings: 150 },
    { name: 'Sat', users: 25, earnings: 130 },
    { name: 'Sun', users: 28, earnings: 140 },
  ];

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const data = {
      userCount: users.length,
      taskCount: tasks.length,
      totalEarnings,
      pendingTasks,
      pendingWithdrawals
    };
    const result = await analyzeDashboard(data);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Center</h1>
          <p className="text-gray-500 text-sm">Real-time system health and performance overview.</p>
        </div>
        <button 
          onClick={handleAIAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing System...' : 'AI Performance Report'}
        </button>
      </div>

      {analysis && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-6 rounded-2xl animate-in slide-in-from-top duration-500">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2">Gemini System Insight</h3>
              <p className="text-indigo-800 dark:text-indigo-300 text-sm mb-4 leading-relaxed">{analysis.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {analysis.suggestions.map((s, i) => (
                  <div key={i} className="bg-white/50 dark:bg-black/20 p-3 rounded-xl text-xs font-medium text-indigo-700 dark:text-indigo-400">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={users.length} icon={<Users />} trend="+12%" up />
        <StatCard title="Active Tasks" value={tasks.filter(t => t.status === 'PUBLISHED').length} icon={<ListTodo />} trend="+5%" up />
        <StatCard title="System Payouts" value={`${currency.symbol}${totalEarnings.toFixed(2)}`} icon={<Wallet />} trend="-2%" />
        <StatCard title="Security Alerts" value="0" icon={<ShieldAlert />} trend="Healthy" up />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6">User Registration Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#4f46e5" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6">System Earnings vs Payouts</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables for Quick Review */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-bold">Pending Approval Requests</h3>
            <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full font-bold">{pendingTasks} Pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 text-gray-400 text-xs uppercase font-bold tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Reward</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {submissions.filter(s => s.status === SubmissionStatus.PENDING).slice(0, 5).map(sub => (
                  <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{sub.userEmail}</td>
                    <td className="px-6 py-4 text-sm">{sub.taskTitle}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">{currency.symbol}{sub.reward.toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(sub.submittedAt).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 font-bold text-xs hover:underline">Review</button>
                    </td>
                  </tr>
                ))}
                {submissions.filter(s => s.status === SubmissionStatus.PENDING).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">No pending requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, up }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${up ? 'text-green-500' : 'text-red-500'}`}>
        {trend}
        {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      </div>
    </div>
    <h4 className="text-gray-500 text-xs font-semibold mb-1">{title}</h4>
    <p className="text-2xl font-bold tracking-tight">{value}</p>
  </div>
);

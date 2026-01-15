
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Users, Search, ShieldCheck, ShieldAlert, 
  ChevronDown, Filter, Trash2, Mail, Calendar,
  Activity, BarChart3
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, toggleUserStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#fdf4ff] to-[#f5f3ff] p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-600 rounded-3xl shadow-[0_10px_0_rgb(88,28,135)] -rotate-6">
              <Users className="text-white w-8 h-8" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-md">
              CITIZEN <span className="text-purple-600">INTEL</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold ml-1 opacity-70 italic">Oversee agent activity and platform integrity.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3.5rem] border-b-[14px] border-slate-200 dark:border-slate-900 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-500" />
          <input 
            type="text" 
            placeholder="Search email identity..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-purple-500/40 focus:ring-8 focus:ring-purple-500/5 text-lg font-bold transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-500" />
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-16 pr-12 py-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-4 border-transparent outline-none focus:border-purple-500/40 text-lg font-black appearance-none cursor-pointer shadow-inner"
            >
              <option value="ALL">ALL ROLES</option>
              <option value={UserRole.ADMIN}>🛡️ ADMINS</option>
              <option value={UserRole.USER}>👤 AGENTS</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            className={`group bg-white dark:bg-slate-800 p-10 rounded-[4rem] border-b-[16px] transition-all transform hover:-translate-y-2 hover:shadow-2xl flex flex-col sm:flex-row items-center gap-10 ${
              user.status === 'BLOCKED' 
              ? 'border-rose-200 dark:border-rose-900/50 opacity-80' 
              : 'border-slate-200 dark:border-slate-900 hover:border-purple-200'
            }`}
          >
            <div className="relative">
              <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-lg border-4 border-white dark:border-slate-800 rotate-6 group-hover:rotate-0 transition-transform ${
                user.role === UserRole.ADMIN ? 'bg-indigo-600 text-white' : 'bg-purple-100 text-purple-600'
              }`}>
                {user.email[0].toUpperCase()}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 ${
                user.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {user.status === 'ACTIVE' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white truncate max-w-[200px]">{user.email.split('@')[0]}</h3>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {user.role}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                  <Mail className="w-4 h-4" /> {user.email}
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                  <Calendar className="w-4 h-4" /> {new Date(user.registeredAt).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Liquid Assets</span>
                  <span className="text-2xl font-black text-emerald-600 tabular-nums">${user.balance.toFixed(2)}</span>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-4 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-indigo-600 rounded-3xl transition-all border-b-4 border-transparent hover:border-indigo-100 active:border-0 active:translate-y-1">
                    <BarChart3 className="w-6 h-6" />
                  </button>
                  {user.role !== UserRole.ADMIN && (
                    <button 
                      onClick={() => toggleUserStatus(user.id)}
                      className={`p-4 rounded-3xl transition-all border-b-4 active:border-0 active:translate-y-1 ${
                        user.status === 'ACTIVE' 
                        ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border-rose-100 hover:border-rose-900' 
                        : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white border-emerald-100 hover:border-emerald-900'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password. Or account is blocked.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Decoration */}
      <div className="hidden md:flex flex-1 gradient-bg items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-6xl font-black mb-6 leading-tight">Start Your Earning Journey.</h1>
          <p className="text-xl opacity-90 leading-relaxed">Join thousands of users who complete simple tasks and earn real rewards every day. Safe, secure, and fast payouts.</p>
        </div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto md:mx-0 mb-4">E</div>
            <h2 className="text-3xl font-black">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Log in to your account to continue earning.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/30"
            >
              Log In Now <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t dark:border-gray-800 text-center">
            <p className="text-gray-500 text-sm">Don't have an account? <button type="button" onClick={() => navigate('/register')} className="text-indigo-600 font-bold hover:underline">Register Here</button></p>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Demo Admin Credentials</p>
            <p className="text-[10px] text-gray-500">t6068422@gmail.com / Aass1122@</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(email, password);
    navigate('/');
  };

  const handleLegalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Legal documentation coming soon.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl">
        <div className="mb-10 text-center">
          <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">E</div>
          <h2 className="text-3xl font-black">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join the community and start earning.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password"
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 gradient-bg text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30"
          >
            Create Account <UserPlus className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <button type="button" onClick={() => navigate('/login')} className="text-indigo-600 font-bold hover:underline">Log In</button>
        </p>

        <div className="mt-8 pt-6 border-t dark:border-gray-700 text-center">
          <p className="text-[10px] text-gray-400">By registering, you agree to our <a href="#" onClick={handleLegalClick} className="underline">Terms of Service</a> and <a href="#" onClick={handleLegalClick} className="underline">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
};
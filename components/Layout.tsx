
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { USER_NAV_ITEMS, ADMIN_NAV_ITEMS } from '../constants';
import { LogOut, Menu, X, Bell, Moon, Sun, Search } from 'lucide-react';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, currency } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return <>{children}</>;

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <span className="text-xl font-bold tracking-tight">EarnTask <span className="text-indigo-600">Pro</span></span>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64"
            />
          </div>
          
          <div className="flex items-center gap-4 border-l dark:border-gray-700 pl-6">
            <button type="button" onClick={toggleDarkMode} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{currency.symbol}{currentUser.balance.toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                {currentUser.email[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Mobile Navigation (Bottom Bar) */}
        {!isAdmin && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-50 px-6 py-3 flex justify-between items-center shadow-lg">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}
                >
                  {item.icon}
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Mobile Admin Sidebar Toggle */}
        {isAdmin && (
          <button 
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center z-50"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Mobile Overlay Sidebar */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-3/4 max-w-xs h-full bg-white dark:bg-gray-800 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold">Menu</span>
                <X className="w-6 h-6" onClick={() => setIsSidebarOpen(false)} />
              </div>
              <nav className="space-y-2 flex-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                    className="w-full flex items-center gap-4 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full flex items-center gap-4 px-4 py-3 text-red-600"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

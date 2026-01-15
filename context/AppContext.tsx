
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Task, TaskSubmission, WithdrawalRequest, 
  AppState, UserRole, TaskStatus, SubmissionStatus, 
  WithdrawalStatus, SystemLog 
} from '../types';
import { INITIAL_TASKS, ADMIN_CREDENTIALS } from '../constants';

interface AppContextType extends AppState {
  login: (email: string, pass: string) => boolean;
  register: (email: string, pass: string) => void;
  logout: () => void;
  addTask: (task: Omit<Task, 'id' | 'completedCount'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  submitTaskProof: (taskId: string, proofImage: string, size: number) => string | null;
  reviewSubmission: (id: string, status: SubmissionStatus, note?: string) => void;
  requestWithdrawal: (amount: number, network: 'BEP20' | 'TRC20', address: string) => string | null;
  reviewWithdrawal: (id: string, status: WithdrawalStatus) => void;
  updateCurrency: (symbol: string, code: string) => void;
  toggleUserStatus: (userId: string) => void;
  addLog: (action: string, type?: 'INFO' | 'WARNING' | 'ERROR') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('earntask_state');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to restore state from local storage:", e);
    }
    
    return {
      currentUser: null,
      tasks: INITIAL_TASKS as Task[],
      submissions: [],
      withdrawals: [],
      users: [
        {
          id: 'admin-1',
          email: ADMIN_CREDENTIALS.email,
          role: UserRole.ADMIN,
          balance: 1000,
          status: 'ACTIVE',
          registeredAt: new Date().toISOString()
        }
      ],
      currency: { symbol: '$', code: 'USD' },
      logs: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('earntask_state', JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state to local storage:", e);
    }
  }, [state]);

  const addLog = (action: string, type: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') => {
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      user: state.currentUser?.email || 'System',
      timestamp: new Date().toISOString(),
      type
    };
    setState(prev => ({ ...prev, logs: [newLog, ...prev.logs].slice(0, 100) }));
  };

  const login = (email: string, pass: string) => {
    if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
      const admin = state.users.find(u => u.email === email);
      setState(prev => ({ ...prev, currentUser: admin || null }));
      addLog('Admin logged in');
      return true;
    }
    const user = state.users.find(u => u.email === email);
    if (user && user.status === 'BLOCKED') return false;
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      addLog(`User ${email} logged in`);
      return true;
    }
    return false;
  };

  const register = (email: string, pass: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role: UserRole.USER,
      balance: 0,
      status: 'ACTIVE',
      registeredAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, users: [...prev.users, newUser], currentUser: newUser }));
    addLog(`New user registered: ${email}`);
  };

  const logout = () => {
    addLog(`User ${state.currentUser?.email} logged out`);
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'completedCount'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      completedCount: 0
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    addLog(`Task created: ${newTask.title}`);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, status: TaskStatus.DELETED } : t)
    }));
    addLog(`Task deleted (soft): ${id}`);
  };

  const submitTaskProof = (taskId: string, proofImage: string, size: number) => {
    if (!state.currentUser) return "User not logged in";
    
    const imageHash = `${size}-${proofImage.substring(100, 200)}`;
    const isDuplicate = state.submissions.some(s => s.imageHash === imageHash);
    
    if (isDuplicate) {
      addLog(`Fraud alert: Duplicate image detected from ${state.currentUser.email}`, 'WARNING');
      return "Duplicate image detected. Please upload an original screenshot.";
    }

    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return "Task not found";
    if (task.completedCount >= task.quantity) return "Task is full";

    const newSubmission: TaskSubmission = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      userId: state.currentUser.id,
      userEmail: state.currentUser.email,
      taskTitle: task.title,
      reward: task.reward,
      proofImage,
      imageSize: size,
      imageHash,
      status: SubmissionStatus.PENDING,
      submittedAt: new Date().toISOString()
    };

    setState(prev => ({ ...prev, submissions: [...prev.submissions, newSubmission] }));
    addLog(`Task proof submitted for: ${task.title}`);
    return null;
  };

  const reviewSubmission = (id: string, status: SubmissionStatus, note?: string) => {
    const sub = state.submissions.find(s => s.id === id);
    if (!sub) return;

    setState(prev => {
      const updatedSubmissions = prev.submissions.map(s => s.id === id ? { ...s, status, adminNote: note } : s);
      const updatedUsers = [...prev.users];
      const updatedTasks = [...prev.tasks];

      if (status === SubmissionStatus.APPROVED) {
        const userIdx = updatedUsers.findIndex(u => u.id === sub.userId);
        if (userIdx !== -1) {
          updatedUsers[userIdx].balance += sub.reward;
        }
        const taskIdx = updatedTasks.findIndex(t => t.id === sub.taskId);
        if (taskIdx !== -1) {
          updatedTasks[taskIdx].completedCount += 1;
        }
      }

      return { 
        ...prev, 
        submissions: updatedSubmissions, 
        users: updatedUsers, 
        tasks: updatedTasks,
        currentUser: prev.currentUser?.id === sub.userId ? updatedUsers.find(u => u.id === sub.userId) || null : prev.currentUser
      };
    });
    addLog(`Submission ${id} ${status.toLowerCase()}`);
  };

  const requestWithdrawal = (amount: number, network: 'BEP20' | 'TRC20', address: string) => {
    if (!state.currentUser || state.currentUser.balance < amount) return 'Insufficient balance';
    if (amount < 1) return 'Minimum withdrawal is $1';

    const newRequest: WithdrawalRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.currentUser.id,
      userEmail: state.currentUser.email,
      amount,
      network,
      address,
      status: WithdrawalStatus.PENDING,
      requestedAt: new Date().toISOString()
    };

    setState(prev => {
      const updatedUsers = prev.users.map(u => u.id === state.currentUser?.id ? { ...u, balance: u.balance - amount } : u);
      return { ...prev, withdrawals: [...prev.withdrawals, newRequest], users: updatedUsers, currentUser: updatedUsers.find(u => u.id === state.currentUser?.id) || null };
    });
    addLog(`Withdrawal requested: ${amount} ${state.currency.code}`);
    return null;
  };

  const reviewWithdrawal = (id: string, status: WithdrawalStatus) => {
    const req = state.withdrawals.find(w => w.id === id);
    if (!req) return;

    setState(prev => {
      const updatedWithdrawals = prev.withdrawals.map(w => w.id === id ? { ...w, status } : w);
      let updatedUsers = [...prev.users];

      if (status === WithdrawalStatus.REJECTED) {
        updatedUsers = updatedUsers.map(u => u.id === req.userId ? { ...u, balance: u.balance + req.amount } : u);
      }

      return { 
        ...prev, 
        withdrawals: updatedWithdrawals, 
        users: updatedUsers,
        currentUser: prev.currentUser?.id === req.userId ? updatedUsers.find(u => u.id === req.userId) || null : prev.currentUser
      };
    });
    addLog(`Withdrawal ${id} ${status.toLowerCase()}`);
  };

  const updateCurrency = (symbol: string, code: string) => {
    setState(prev => ({ ...prev, currency: { symbol, code } }));
    addLog(`Currency updated to ${code}`);
  };

  const toggleUserStatus = (userId: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' } : u)
    }));
    addLog(`User status toggled: ${userId}`);
  };

  return (
    <AppContext.Provider value={{ 
      ...state, 
      login, register, logout, 
      addTask, updateTask, deleteTask, 
      submitTaskProof, reviewSubmission, 
      requestWithdrawal, reviewWithdrawal,
      updateCurrency, toggleUserStatus, addLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

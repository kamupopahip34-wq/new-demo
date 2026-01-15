
import React from 'react';
import { 
  Home, 
  CheckCircle, 
  Wallet, 
  User, 
  Settings, 
  LayoutDashboard, 
  ListTodo, 
  Clock, 
  Users, 
  DollarSign, 
  ShieldAlert,
  Bell
} from 'lucide-react';

export const ADMIN_CREDENTIALS = {
  email: 't6068422@gmail.com',
  password: 'Aass1122@'
};

export const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Subscribe to YouTube Channel',
    description: 'Visit our main channel and subscribe. Turn on all notifications.',
    reward: 0.50,
    quantity: 100,
    completedCount: 0,
    instruction: 'Upload a screenshot showing your subscription and bell icon.',
    status: 'PUBLISHED'
  },
  {
    id: '2',
    title: 'Follow on Twitter',
    description: 'Follow @EarnTaskPro on Twitter and like our latest pinned post.',
    reward: 0.25,
    quantity: 500,
    completedCount: 12,
    instruction: 'Screenshot of your follow button and the liked post.',
    status: 'PUBLISHED'
  }
];

export const USER_NAV_ITEMS = [
  { label: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
  { label: 'Tasks', path: '/tasks', icon: <ListTodo className="w-5 h-5" /> },
  { label: 'Requests', path: '/requests', icon: <Clock className="w-5 h-5" /> },
  { label: 'Wallet', path: '/wallet', icon: <Wallet className="w-5 h-5" /> },
  { label: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
];

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Tasks', path: '/admin/tasks', icon: <ListTodo className="w-5 h-5" /> },
  { label: 'Requests', path: '/admin/requests', icon: <Clock className="w-5 h-5" /> },
  { label: 'Withdrawals', path: '/admin/withdrawals', icon: <DollarSign className="w-5 h-5" /> },
  { label: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
  { label: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];

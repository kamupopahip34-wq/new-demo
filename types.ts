
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum TaskStatus {
  PUBLISHED = 'PUBLISHED',
  HOLD = 'HOLD',
  DELETED = 'DELETED'
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  balance: number;
  status: 'ACTIVE' | 'BLOCKED';
  registeredAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  quantity: number;
  completedCount: number;
  instruction: string;
  status: TaskStatus;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  userEmail: string;
  taskTitle: string;
  reward: number;
  proofImage: string; // Base64
  imageSize?: number;
  imageHash?: string; // For anti-fraud
  status: SubmissionStatus;
  submittedAt: string;
  adminNote?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  network: 'BEP20' | 'TRC20';
  address: string;
  status: WithdrawalStatus;
  requestedAt: string;
}

export interface CurrencySettings {
  symbol: string;
  code: string;
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
}

export interface AppState {
  currentUser: User | null;
  tasks: Task[];
  submissions: TaskSubmission[];
  withdrawals: WithdrawalRequest[];
  users: User[];
  currency: CurrencySettings;
  logs: SystemLog[];
}

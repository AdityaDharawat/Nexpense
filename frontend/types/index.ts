export interface User {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  avatarUrl?: string | null;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  amount: number;
  category: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";
  receiptUrl?: string | null;
  approverId?: string | null;
  remark?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  approver?: User;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, any>;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: User;
  };
}

export interface ExpensesResponse {
  status: string;
  data: {
    items: Expense[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  status: string;
  message: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface ExpenseForm {
  title: string;
  description?: string;
  amount: number;
  category: string;
  receipt?: File;
}

export interface ExpenseFilters {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AnalyticsData {
  totalExpenses: number;
  approvedExpenses: number;
  rejectedExpenses: number;
  pendingExpenses: number;
  totalAmount: number;
  monthlyTrends: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
}

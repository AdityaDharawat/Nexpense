import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Expense, Notification } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      checkAuth: async () => {
        // This will be implemented when we connect to the API
        set({ isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

interface ExpenseState {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  setExpenses: (expenses: Expense[], total: number, page: number, limit: number) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  fetchExpenses: () => Promise<void>;
  createExpense: (formData: FormData) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  setExpenses: (expenses, total, page, limit) => set({ expenses, total, page, limit }),
  addExpense: (expense) => {
    const current = get().expenses;
    set({ expenses: [expense, ...current] });
  },
  updateExpense: (id, updates) => {
    const current = get().expenses;
    const updated = current.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp));
    set({ expenses: updated });
  },
  removeExpense: (id) => {
    const current = get().expenses;
    set({ expenses: current.filter((exp) => exp.id !== id) });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({ expenses: [], total: 0, page: 1, limit: 20 }),
  fetchExpenses: async () => {
    // This will be implemented when we connect to the API
    set({ isLoading: false });
  },
  createExpense: async (formData) => {
    // This will be implemented when we connect to the API
    set({ isLoading: false });
  },
}));

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setLoading: (loading: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount });
  },
  addNotification: (notification) => {
    const current = get().notifications;
    const unreadCount = get().unreadCount + (notification.read ? 0 : 1);
    set({ notifications: [notification, ...current], unreadCount });
  },
  markAsRead: (id) => {
    const current = get().notifications;
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    const unreadCount = updated.filter((n) => !n.read).length;
    set({ notifications: updated, unreadCount });
  },
  markAllAsRead: () => {
    const current = get().notifications;
    const updated = current.map((n) => ({ ...n, read: true }));
    set({ notifications: updated, unreadCount: 0 });
  },
  setLoading: (loading) => set({ isLoading: loading }),
}));

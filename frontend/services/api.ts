import axios, { AxiosInstance, AxiosResponse } from "axios";
import type { AuthResponse, ExpensesResponse, ApiError, LoginForm, RegisterForm, ExpenseForm, ExpenseFilters } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterForm): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>("/auth/register", data);
    return response.data;
  }

  async login(data: LoginForm): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>("/auth/login", data);
    return response.data;
  }

  async logout(): Promise<{ status: string; message: string }> {
    const response = await this.api.post("/auth/logout");
    return response.data;
  }

  async refreshToken(): Promise<{ status: string }> {
    const response = await this.api.post("/auth/refresh");
    return response.data;
  }

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await this.api.get<AuthResponse>("/auth/me");
    return response.data;
  }

  async forgotPassword(email: string): Promise<{ status: string; data: { resetToken: string } }> {
    const response = await this.api.post("/auth/forgot-password", { email });
    return response.data;
  }

  async resetPassword(token: string, password: string): Promise<{ status: string; message: string }> {
    const response = await this.api.post("/auth/reset-password", { token, password });
    return response.data;
  }

  // Expense endpoints
  async createExpense(data: ExpenseForm): Promise<{ status: string; data: { expense: any } }> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("amount", data.amount.toString());
    formData.append("category", data.category);
    if (data.description) formData.append("description", data.description);
    if (data.receipt) formData.append("receipt", data.receipt);

    const response = await this.api.post("/expenses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async getExpenses(filters?: ExpenseFilters): Promise<ExpensesResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await this.api.get<ExpensesResponse>(`/expenses?${params.toString()}`);
    return response.data;
  }

  async updateExpense(id: string, data: Partial<ExpenseForm>): Promise<{ status: string; data: { updated: number } }> {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.amount !== undefined) formData.append("amount", data.amount.toString());
    if (data.category) formData.append("category", data.category);
    if (data.description) formData.append("description", data.description);
    if (data.receipt) formData.append("receipt", data.receipt);

    const response = await this.api.patch(`/expenses/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async deleteExpense(id: string): Promise<{ status: string; data: { deleted: number } }> {
    const response = await this.api.delete(`/expenses/${id}`);
    return response.data;
  }

  // Admin endpoints
  async getAllExpenses(filters?: ExpenseFilters): Promise<ExpensesResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await this.api.get<ExpensesResponse>(`/admin/expenses?${params.toString()}`);
    return response.data;
  }

  async approveExpense(id: string, status: "APPROVED" | "REJECTED", remark?: string): Promise<{ status: string; data: { expense: any } }> {
    const response = await this.api.patch(`/admin/expenses/${id}`, { status, remark });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await this.api.get("/health");
    return response.data;
  }
}

export const apiService = new ApiService();

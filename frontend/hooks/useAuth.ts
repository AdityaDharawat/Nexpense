import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store";
import { apiService } from "../services/api";
import { useToast } from "./use-toast";

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, setLoading } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiService.getCurrentUser();
        login(response.data.user);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, login, logout, setLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiService.login({ email, password });
      login(response.data.user);
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiService.register({ name, email, password });
      login(response.data.user);
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await apiService.logout();
      logout();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: "There was an issue signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}

export function useRequireAdmin() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, user, router]);

  return { isAuthenticated, isLoading, user };
}

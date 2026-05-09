import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Receipt, Users, DollarSign, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingExpenses: 0,
    approvedExpenses: 0,
    rejectedExpenses: 0,
    totalUsers: 0,
    totalAmount: 0,
  });
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from the API
    // For now, we'll use mock data
    setStats({
      totalExpenses: 45,
      pendingExpenses: 12,
      approvedExpenses: 28,
      rejectedExpenses: 5,
      totalUsers: 8,
      totalAmount: 15420.50,
    });

    setRecentExpenses([
      {
        id: '1',
        description: 'Office Supplies',
        amount: 150.00,
        status: 'PENDING',
        user: { name: 'John Doe' },
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        description: 'Business Lunch',
        amount: 75.50,
        status: 'APPROVED',
        user: { name: 'Jane Smith' },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        description: 'Software License',
        amount: 299.99,
        status: 'PENDING',
        user: { name: 'Bob Johnson' },
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]);

    setIsLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Access denied. Admin privileges required.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage expenses and users across the organization</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExpenses}</div>
              <p className="text-xs text-muted-foreground">
                All expenses in system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingExpenses}</div>
              <p className="text-xs text-muted-foreground">
                Require your attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Active users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
              <p className="text-xs text-muted-foreground">
                Approved expenses total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Latest expense submissions requiring attention</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/admin/expenses">
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : recentExpenses.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No recent expenses
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.description}
                        </TableCell>
                        <TableCell>{expense.user.name}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(expense.status)}>
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(expense.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link href="/dashboard/admin/expenses">
                  <Receipt className="h-4 w-4 mr-2" />
                  Review Pending Expenses
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/admin/audit">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Audit Logs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/analytics">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Approval Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                {stats.pendingExpenses} expenses waiting for your approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/dashboard/admin/expenses?status=PENDING">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Review Pending ({stats.pendingExpenses})
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/admin/expenses">
                    View All Expenses
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

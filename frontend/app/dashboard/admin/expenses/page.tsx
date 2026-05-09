import { useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { DashboardLayout } from "../../../../components/layout/dashboard-layout";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("PENDING");

  useEffect(() => {
    // In a real app, this would fetch from the API
    // For now, we'll use mock data
    const mockExpenses = [
      {
        id: '1',
        description: 'Office Supplies',
        amount: 150.00,
        status: 'PENDING',
        category: 'Office Supplies',
        user: { name: 'John Doe', email: 'john@example.com' },
        createdAt: new Date().toISOString(),
        receiptUrl: null,
      },
      {
        id: '2',
        description: 'Business Lunch',
        amount: 75.50,
        status: 'APPROVED',
        category: 'Meals',
        user: { name: 'Jane Smith', email: 'jane@example.com' },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        receiptUrl: 'https://example.com/receipt1.jpg',
      },
      {
        id: '3',
        description: 'Software License',
        amount: 299.99,
        status: 'PENDING',
        category: 'Software',
        user: { name: 'Bob Johnson', email: 'bob@example.com' },
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        receiptUrl: 'https://example.com/receipt2.jpg',
      },
      {
        id: '4',
        description: 'Travel Expenses',
        amount: 450.00,
        status: 'REJECTED',
        category: 'Travel',
        user: { name: 'Alice Brown', email: 'alice@example.com' },
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        rejectionReason: 'Missing receipt',
      },
    ];

    setExpenses(mockExpenses);
    setIsLoading(false);
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
    if (filter === "ALL") return true;
    return expense.status === filter;
  });

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

  const handleApprove = async (expenseId: string) => {
    // In a real app, this would call the API
    console.log('Approving expense:', expenseId);
    // Update local state
    setExpenses(expenses.map(exp =>
      exp.id === expenseId ? { ...exp, status: 'APPROVED' } : exp
    ));
  };

  const handleReject = async (expenseId: string) => {
    // In a real app, this would call the API
    console.log('Rejecting expense:', expenseId);
    // Update local state
    setExpenses(expenses.map(exp =>
      exp.id === expenseId ? { ...exp, status: 'REJECTED' } : exp
    ));
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">Review and manage all expense submissions</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === "ALL" ? "All" : status}
            </Button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Expenses</CardTitle>
            <CardDescription>
              {filter === "ALL"
                ? "All expense submissions in the system"
                : `${filter} expenses`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading expenses...</div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {filter === "ALL"
                    ? "No expenses found in the system"
                    : `No ${filter.toLowerCase()} expenses found.`}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {expense.description}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{expense.user.name}</p>
                          <p className="text-sm text-gray-500">{expense.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(expense.status)}>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(expense.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/admin/expenses/${expense.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {expense.status === 'PENDING' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(expense.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(expense.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

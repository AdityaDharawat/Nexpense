import { useEffect, useState } from "react";
import { useExpenseStore } from "@/store";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, Edit } from "lucide-react";
import Link from "next/link";

export default function ExpensesPage() {
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredExpenses = expenses?.filter((expense: any) => {
    if (filter === "ALL") return true;
    return expense.status === filter;
  }) || [];

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

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>
            <p className="text-gray-600">Manage your expense submissions</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/expenses/new">
              <Plus className="h-4 w-4 mr-2" />
              New Expense
            </Link>
          </Button>
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
            <CardTitle>Expense History</CardTitle>
            <CardDescription>
              {filter === "ALL"
                ? "All your expense submissions"
                : `${filter} expenses`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading expenses...</div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {filter === "ALL"
                    ? "No expenses found. Create your first expense!"
                    : `No ${filter.toLowerCase()} expenses found.`}
                </p>
                <Button asChild>
                  <Link href="/dashboard/expenses/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Expense
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense: any) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {expense.description}
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
                            <Link href={`/dashboard/expenses/${expense.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {expense.status === 'PENDING' && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/expenses/${expense.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
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

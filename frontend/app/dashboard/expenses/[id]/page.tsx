import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExpenseStore } from "@/store";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Edit } from "lucide-react";
import Link from "next/link";

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();
  const [expense, setExpense] = useState<any>(null);

  const expenseId = params.id as string;

  useEffect(() => {
    if (!expenses) {
      fetchExpenses();
    }
  }, [expenses, fetchExpenses]);

  useEffect(() => {
    if (expenses && expenseId) {
      const foundExpense = expenses.find((e: any) => e.id === expenseId);
      setExpense(foundExpense);
    }
  }, [expenses, expenseId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-8">Loading expense details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!expense) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Expense not found</p>
            <Button asChild>
              <Link href="/dashboard/expenses">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Expenses
              </Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/expenses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Expenses
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Expense Details</h1>
          <p className="text-gray-600">View expense information and status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{expense.description}</CardTitle>
                    <CardDescription>Expense #{expense.id.slice(-8)}</CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(expense.status)} className="text-sm">
                    {expense.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-lg text-gray-900">{expense.category}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900 mt-1">{expense.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-gray-900">{formatDate(expense.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-gray-900">{formatDate(expense.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments/Notes */}
            {expense.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{expense.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {expense.status === 'PENDING' && (
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/expenses/${expense.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Expense
                    </Link>
                  </Button>
                )}

                {expense.receiptUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Receipt Preview */}
            {expense.receiptUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Receipt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={expense.receiptUrl}
                      alt="Receipt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Approval Info */}
            {(expense.status === 'APPROVED' || expense.status === 'REJECTED') && (
              <Card>
                <CardHeader>
                  <CardTitle>Approval Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Approved By</label>
                    <p className="text-gray-900">{expense.approvedBy || 'System'}</p>
                  </div>
                  {expense.approvedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Approved At</label>
                      <p className="text-gray-900">{formatDate(expense.approvedAt)}</p>
                    </div>
                  )}
                  {expense.rejectionReason && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                      <p className="text-red-600 mt-1">{expense.rejectionReason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

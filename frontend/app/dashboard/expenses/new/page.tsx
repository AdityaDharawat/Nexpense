import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useExpenseStore } from "@/store";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const expenseSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string().min(1, "Please select a category"),
  receipt: z.instanceof(FileList).optional(),
});

type ExpenseForm = z.infer<typeof expenseSchema>;

const categories = [
  "Office Supplies",
  "Travel",
  "Meals",
  "Software",
  "Hardware",
  "Marketing",
  "Training",
  "Other",
];

export default function NewExpensePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { createExpense } = useExpenseStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),
  });

  const onSubmit = async (data: ExpenseForm) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("description", data.description);
      formData.append("amount", data.amount);
      formData.append("category", data.category);

      if (data.receipt && data.receipt[0]) {
        formData.append("receipt", data.receipt[0]);
      }

      await createExpense(formData);
      router.push("/dashboard");
    } catch (error) {
      // Error is handled in the store
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Expense</h1>
          <p className="text-gray-600">Submit a new expense for approval</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
            <CardDescription>
              Fill in the details of your expense. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Input
                  id="description"
                  type="text"
                  placeholder="What was this expense for?"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("amount")}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  {...register("category")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt (Optional)
                </label>
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  {...register("receipt")}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload a receipt image or PDF (max 5MB)
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Submitting..." : "Submit Expense"}
                </Button>
                <Button type="button" variant="outline" asChild className="flex-1">
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitEarnings } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../layout";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, IndianRupee, PlusCircle, Trash2, Send } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const earningsSchema = z.object({
  earnings: z.array(z.object({
    description: z.string().min(3, "Description must be at least 3 characters."),
    amount: z.coerce.number().min(1, "Amount must be a positive number."),
  })).min(1, "Please add at least one earning entry."),
});

type EarningsFormData = z.infer<typeof earningsSchema>;

interface SubmittedEarning {
    id: string;
    description: string;
    amount: number;
    date: string;
}

export default function EarningsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEarnings, setSubmittedEarnings] = useState<SubmittedEarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<EarningsFormData>({
    resolver: zodResolver(earningsSchema),
    defaultValues: {
      earnings: [{ description: "", amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "earnings",
  });

   useEffect(() => {
    if (!user) return;
    const fetchEarnings = async () => {
        setIsLoading(true);
        try {
            const q = query(
                collection(db, "earnings"), 
                where("employeeId", "==", user.uid),
                orderBy("date", "desc")
            );
            const querySnapshot = await getDocs(q);
            const earnings = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: format((data.date as Timestamp).toDate(), "PP"),
                } as SubmittedEarning;
            });
            setSubmittedEarnings(earnings);
        } catch (error) {
            console.error("Error fetching earnings:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not fetch earnings."});
        } finally {
            setIsLoading(false);
        }
    };
    fetchEarnings();
  }, [user, toast]);


  async function onSubmit(values: EarningsFormData) {
     if (!user) {
        toast({ variant: "destructive", title: "Error", description: "You must be logged in." });
        return;
    }
    setIsSubmitting(true);
    const result = await submitEarnings({ earnings: values.earnings, employeeId: user.uid, employeeName: user.displayName || user.email || "Unknown" });
    if (result.success) {
      toast({ title: "Success!", description: result.message });
      const newSubmissions: SubmittedEarning[] = values.earnings.map(e => ({
          ...e,
          id: new Date().toISOString() + Math.random(),
          date: format(new Date(), "PP")
      }));
      setSubmittedEarnings(prev => [...newSubmissions, ...prev]);
      form.reset({ earnings: [{ description: "", amount: 0 }] });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message, errors: result.errors });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Submit Your Earnings</h1>
          <p className="text-muted-foreground">Report the revenue you have generated for the company.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>New Earning Entry</CardTitle>
            <CardDescription>Add one or more earning details below. Click "Add Earning" for multiple entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4 p-4 rounded-md border">
                      <FormField
                        control={form.control}
                        name={`earnings.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Description</FormLabel>
                            <FormControl><Input placeholder="e.g., Booking from Client X" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`earnings.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (INR)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 50000" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                 <FormMessage>{form.formState.errors.earnings?.message || form.formState.errors.earnings?.root?.message}</FormMessage>

                <div className="flex justify-between items-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ description: "", amount: 0 })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Earning
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Submit All Earnings
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recent Earning Submissions</CardTitle>
                <CardDescription>Here are the earnings you've submitted recently.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <div className="flex justify-center items-center h-24"><Loader2 className="h-6 w-6 animate-spin" /></div> :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submittedEarnings.length > 0 ? submittedEarnings.map((earning) => (
                            <TableRow key={earning.id}>
                                <TableCell>{earning.date}</TableCell>
                                <TableCell className="font-medium">{earning.description}</TableCell>
                                <TableCell className="text-right font-semibold">₹{earning.amount.toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No earnings submitted yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

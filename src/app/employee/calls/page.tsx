
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { logCall } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../layout";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, PhoneForwarded } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";


const callLogSchema = z.object({
  clientName: z.string().min(2, "Client name is required."),
  clientMobile: z.string().min(10, "A valid mobile number is required."),
  topic: z.string().min(5, "Topic must be at least 5 characters."),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute."),
});

type CallLogFormData = z.infer<typeof callLogSchema>;

interface CallLog extends CallLogFormData {
  id: string;
  date: string;
}

export default function CallsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<CallLogFormData>({
    resolver: zodResolver(callLogSchema),
    defaultValues: {
      clientName: "", clientMobile: "", topic: "", duration: undefined,
    },
  });

  useEffect(() => {
    if (!user) return;
    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const q = query(
                collection(db, "callLogs"), 
                where("employeeId", "==", user.uid),
                orderBy("date", "desc")
            );
            const querySnapshot = await getDocs(q);
            const logs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: format((data.date as Timestamp).toDate(), 'PP'),
                } as CallLog;
            });
            setCallLogs(logs);
        } catch (error) {
            console.error("Error fetching call logs:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not fetch call logs."});
        } finally {
            setIsLoading(false);
        }
    };
    fetchLogs();
  }, [user, toast]);

  async function onSubmit(values: CallLogFormData) {
    if (!user) {
        toast({ variant: "destructive", title: "Error", description: "You must be logged in." });
        return;
    }
    setIsSubmitting(true);
    const result = await logCall({ ...values, employeeId: user.uid, employeeName: user.displayName || user.email || "Unknown" });
    if (result.success) {
      toast({ title: "Success!", description: result.message });
      setCallLogs(prev => [{ ...values, id: new Date().toISOString(), date: format(new Date(), 'PP') }, ...prev]);
      form.reset();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message, errors: result.errors });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Log Your Calls</h1>
          <p className="text-muted-foreground">Keep a record of all your client communications.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>New Call Entry</CardTitle>
            <CardDescription>Fill in the details for a call you made.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="clientName" render={({ field }) => (<FormItem><FormLabel>Client Name</FormLabel><FormControl><Input placeholder="e.g., John Smith" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="clientMobile" render={({ field }) => (<FormItem><FormLabel>Client Mobile No.</FormLabel><FormControl><Input type="tel" placeholder="e.g., 9876543210" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="topic" render={({ field }) => (<FormItem><FormLabel>Discussion Topic</FormLabel><FormControl><Input placeholder="e.g., Project Discovery Call" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="duration" render={({ field }) => (<FormItem><FormLabel>Duration (in minutes)</FormLabel><FormControl><Input type="number" placeholder="e.g., 15" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PhoneForwarded className="mr-2 h-4 w-4" />}
                  Log Call
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recent Call Logs</CardTitle>
                <CardDescription>Here are the calls you've logged recently.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <div className="flex justify-center items-center h-24"><Loader2 className="h-6 w-6 animate-spin" /></div> :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Topic</TableHead>
                            <TableHead className="text-right">Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {callLogs.length > 0 ? callLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell>{log.date}</TableCell>
                                <TableCell className="font-medium">{log.clientName}</TableCell>
                                <TableCell>{log.topic}</TableCell>
                                <TableCell className="text-right">{log.duration} mins</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">No calls logged yet.</TableCell>
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

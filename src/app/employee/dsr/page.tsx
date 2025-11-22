
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitDsr } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../layout";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, ClipboardList, Car } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const dsrSchema = z.object({
  description: z.string().min(10, "Please provide a detailed description of your work."),
  hasTravelled: z.boolean().default(false),
  openingKm: z.coerce.number().optional(),
  closingKm: z.coerce.number().optional(),
}).refine(data => {
    if (data.hasTravelled) {
        return data.openingKm !== undefined && data.closingKm !== undefined && data.closingKm > data.openingKm;
    }
    return true;
}, {
    message: "Closing KM must be greater than Opening KM.",
    path: ["closingKm"],
});

type DsrFormData = z.infer<typeof dsrSchema>;

interface DsrLog extends DsrFormData {
    id: string;
    date: string;
}

export default function DsrPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dsrLogs, setDsrLogs] = useState<DsrLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<DsrFormData>({
    resolver: zodResolver(dsrSchema),
    defaultValues: {
      description: "",
      hasTravelled: false,
    },
  });

  const { watch } = form;
  const hasTravelled = watch("hasTravelled");

  useEffect(() => {
    if (!user) return;
    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const q = query(
                collection(db, "dsr"), 
                where("employeeId", "==", user.uid),
                orderBy("date", "desc")
            );
            const querySnapshot = await getDocs(q);
            const logs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: format((data.date as Timestamp).toDate(), "PP"),
                } as DsrLog;
            });
            setDsrLogs(logs);
        } catch (error) {
            console.error("Error fetching DSR logs:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not fetch DSR logs."});
        } finally {
            setIsLoading(false);
        }
    };
    fetchLogs();
  }, [user, toast]);

  async function onSubmit(values: DsrFormData) {
    if (!user) {
        toast({ variant: "destructive", title: "Error", description: "You must be logged in." });
        return;
    }
    setIsSubmitting(true);
    const result = await submitDsr({ ...values, employeeId: user.uid, employeeName: user.displayName || user.email || "Unknown" });
    if (result.success) {
      toast({ title: "Success!", description: result.message });
       setDsrLogs(prev => [{ ...values, id: new Date().toISOString(), date: format(new Date(), "PP") }, ...prev]);
      form.reset();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message, errors: result.errors });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Daily Status Report (DSR)</h1>
          <p className="text-muted-foreground">Log your work activities for the day.</p>
        </header>

        <Card>
           <CardHeader>
                <CardTitle>New DSR Entry</CardTitle>
                <CardDescription>Fill out your activities for today.</CardDescription>
            </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the tasks you completed, clients you contacted, and any other work-related activities..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasTravelled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I have travelled for a visit today.
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {hasTravelled && (
                    <div className="space-y-4 rounded-md border p-4">
                        <h4 className="font-semibold flex items-center gap-2"><Car /> Travel Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="openingKm"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Opening KM</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 15000" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="closingKm"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Closing KM</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g., 15100" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ) : ( <ClipboardList className="mr-2 h-4 w-4" /> )}
                  Submit DSR
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Recent DSR Logs</CardTitle>
                <CardDescription>Here are the DSRs you've submitted recently.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <div className="flex justify-center items-center h-24"><Loader2 className="h-6 w-6 animate-spin" /></div> :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Travel (KM)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dsrLogs.length > 0 ? dsrLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell>{log.date}</TableCell>
                                <TableCell className="font-medium truncate max-w-xs">{log.description}</TableCell>
                                <TableCell className="text-right">
                                    {log.hasTravelled && log.closingKm && log.openingKm 
                                        ? (log.closingKm - log.openingKm) 
                                        : 'N/A'
                                    }
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No DSRs submitted yet.</TableCell>
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

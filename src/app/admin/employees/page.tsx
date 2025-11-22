
"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, Timestamp, addDoc } from "firebase/firestore";

import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, UserCheck, UserX, Send, FileText, Loader2, PlusCircle, UserPlus, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerEmployee } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface Employee {
  id: string;
  name: string;
  userId: string; // The email-like ID
  status: 'active' | 'inactive';
  createdAt: Timestamp;
}

const registrationSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  mobile: z.string().min(10, "A valid 10-digit mobile number is required.").max(10, "A valid 10-digit mobile number is required."),
  personalEmail: z.string().email("Please enter a valid personal email."),
  userId: z.string().min(3, "User ID is required.").refine(val => val.endsWith('@zensolve.in'), { message: "User ID must end with @zensolve.in" }),
  password: z.string().min(6, "Password must be at least 6 characters."),
  district: z.string().min(2, "District is required."),
  state: z.string().min(2, "State is required."),
  pincode: z.string().length(6, "Pincode must be 6 digits."),
});
type RegistrationFormData = z.infer<typeof registrationSchema>;

interface GeneratedCredentials {
  userId: string;
  password?: string;
}

const RegisterEmployeeDialog = ({ onEmployeeRegistered }: { onEmployeeRegistered: () => void }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState<GeneratedCredentials | null>(null);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "", district: "", state: "", pincode: "", personalEmail: "", mobile: "", userId: "", password: ""
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: RegistrationFormData) {
    setCredentials(null);

    const result = await registerEmployee(values);

    if (result.success && result.userId && result.password) {
      toast({ title: "Registration Successful!", description: "Employee account has been created." });
      setCredentials({ userId: result.userId, password: result.password });
      form.reset();
      onEmployeeRegistered(); // To re-fetch employee list
    } else {
      toast({ variant: "destructive", title: "Registration Failed", description: result.message });
    }
  }
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        setCredentials(null);
        form.reset();
    }
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button><UserPlus className="mr-2 h-4 w-4" /> Register New Employee</Button>
      </DialogTrigger>
       <DialogContent className="sm:max-w-md">
        {!credentials ? (
          <>
            <DialogHeader>
              <DialogTitle>Register New Employee</DialogTitle>
              <DialogDescription>Fill in the details to create a new employee account.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Rohit Kumar" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="personalEmail" render={({ field }) => (<FormItem><FormLabel>Personal Email</FormLabel><FormControl><Input placeholder="rohit@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="mobile" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="userId" render={({ field }) => (<FormItem><FormLabel>User ID</FormLabel><FormControl><Input placeholder="rohit@zensolve.in" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <FormField control={form.control} name="district" render={({ field }) => (<FormItem><FormLabel>District</FormLabel><FormControl><Input placeholder="Godda" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="Jharkhand" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="pincode" render={({ field }) => (<FormItem><FormLabel>Pincode</FormLabel><FormControl><Input placeholder="814133" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register
                </Button>
              </DialogFooter>
            </form>
          </Form>
          </>
        ) : (
          <>
            <DialogHeader className="items-center text-center">
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-2">
                    <PartyPopper className="h-6 w-6 text-green-600" />
                </div>
                <DialogTitle>Registration Complete!</DialogTitle>
                <DialogDescription>
                    Here are the new credentials. Please save them securely and share with the employee.
                </DialogDescription>
            </DialogHeader>
             <Alert>
                <AlertTitle className="text-left">New Credentials</AlertTitle>
                <AlertDescription className="text-left">
                    <p className="mt-2"><strong>User ID:</strong> {credentials.userId}</p>
                    <p><strong>Password:</strong> {credentials.password}</p>
                </AlertDescription>
            </Alert>
             <DialogFooter>
                <Button onClick={() => handleOpenChange(false)}>Done</Button>
             </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const SendWorkDialog = ({ employee }: { employee: Employee }) => {
    const { toast } = useToast();
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [title, setTitle] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSendWork = async () => {
        if (!title.trim() || !description.trim()) {
            toast({ variant: 'destructive', title: "Error", description: "Title and description are required." });
            return;
        }
        setIsSending(true);
        try {
            await addDoc(collection(db, 'tasks'), {
                employeeId: employee.id,
                employeeName: employee.name,
                title,
                description,
                priority,
                status: 'pending',
                assignedAt: Timestamp.now(),
            });
            toast({ title: "Success", description: `Task assigned to ${employee.name}` });
            setDescription('');
            setTitle('');
            setPriority('Medium');
            setOpen(false);
        } catch (error) {
            console.error('Error assigning task: ', error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to assign task." });
        } finally {
            setIsSending(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Send className="mr-2 h-4 w-4" /> Send Work</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send Work to {employee.name}</DialogTitle>
                    <DialogDescription>Assign a new task or send instructions to this employee.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="task-title">Title</Label>
                        <Input id="task-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter task title" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="task-description">Task Description</Label>
                        <Textarea id="task-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter task details here..." className="min-h-[120px]" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="task-priority">Priority</Label>
                        <select id="task-priority" value={priority} onChange={e => setPriority(e.target.value)} className="w-full p-2 border rounded-md bg-transparent">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSendWork} disabled={isSending}>
                        {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Send Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeRegistered, setEmployeeRegistered] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "employees"), orderBy("createdAt", "desc"));
    const unsubscribeEmployees = onSnapshot(q, (querySnapshot) => {
      const employeesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
      setEmployees(employeesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching employees: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load employees." });
      setIsLoading(false);
    });

    return () => unsubscribeEmployees();
  }, [toast, employeeRegistered]);

  const activeEmployees = employees.filter(e => e.status === 'active').length;

  return (
    <div className="flex min-h-screen flex-col bg-secondary p-4 sm:p-6 lg:p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Manage Employees</h1>
            <p className="text-muted-foreground">Register, view, and manage your employees.</p>
        </div>
        <RegisterEmployeeDialog onEmployeeRegistered={() => setEmployeeRegistered(c => c + 1)} />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{employees.length}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{activeEmployees}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive Employees</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{employees.length - activeEmployees}</div>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>View, manage, and assign tasks to your employees.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.userId}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.status === 'active' ? 'default' : 'destructive'} className="capitalize bg-green-100 text-green-800">
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {employee.createdAt ? formatDistanceToNow(employee.createdAt.toDate(), { addSuffix: true }) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <SendWorkDialog employee={employee} />
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/admin/employees/report?id=${employee.id}`}>
                           <FileText className="mr-2 h-4 w-4" /> View Report
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

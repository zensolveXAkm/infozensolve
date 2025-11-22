
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ListTodo, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../layout";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedAt: Timestamp;
  status: 'pending' | 'completed';
  employeeId: string;
}

export default function PendingWorkPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    };
    
    setIsLoading(true);
    const q = query(
        collection(db, "tasks"), 
        where("employeeId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tasksData.sort((a,b) => b.assignedAt.toMillis() - a.assignedAt.toMillis()));
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching tasks:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch tasks."
        });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleMarkAsCompleted = async (taskId: string) => {
    setIsUpdating(taskId);
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: 'completed'
      });
      toast({
        title: "Success",
        description: "Task marked as completed."
      });
    } catch (error) {
       console.error("Error updating task:", error);
       toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update task status."
       });
    } finally {
        setIsUpdating(null);
    }
  };
  
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const getPriorityBadgeVariant = (priority: 'High' | 'Medium' | 'Low') => {
      switch(priority) {
          case 'High': return 'destructive';
          case 'Medium': return 'default';
          case 'Low': return 'secondary';
          default: return 'secondary';
      }
  }

  if (!user) {
    return <div className="flex items-center justify-center h-full"><p>Please log in to see your tasks.</p></div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Pending Work</h1>
          <p className="text-muted-foreground">Here are the tasks assigned to you by the admin.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <CardDescription>Review your tasks and mark them as completed.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                 <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : pendingTasks.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {pendingTasks.map(task => (
                        <AccordionItem value={task.id} key={task.id}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4 text-left">
                                    <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                                    <span className="font-semibold">{task.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    <p className="text-muted-foreground">{task.description}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground">Assigned: {task.assignedAt?.toDate().toLocaleDateString()}</p>
                                        <Button size="sm" onClick={() => handleMarkAsCompleted(task.id)} disabled={isUpdating === task.id}>
                                            {isUpdating === task.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                                            Mark as Completed
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No pending tasks. Great job!</p>
                </div>
            )}
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
            <CardDescription>Tasks you have recently completed.</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                 <div className="flex justify-center items-center h-20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : completedTasks.length > 0 ? (
                <ul className="space-y-2">
                    {completedTasks.map(task => (
                        <li key={task.id} className="flex items-center justify-between rounded-md border p-3 bg-muted/50">
                            <span className="text-muted-foreground line-through">{task.title}</span>
                             <Badge variant="outline" className="text-green-600 border-green-600">Completed</Badge>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No tasks completed yet.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

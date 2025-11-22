
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { markAttendance } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../layout";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CalendarCheck, LogIn, LogOut } from "lucide-react";
import { Label } from "@/components/ui/label";

const attendanceSchema = z.object({
  status: z.enum(["working", "leave"], {
    required_error: "You need to select your status.",
  }),
  tasks: z.string().optional(),
}).refine(data => {
    if (data.status === 'working' && (!data.tasks || data.tasks.length < 10)) {
        return false;
    }
    return true;
}, {
    message: "Please enter your tasks for the day (min 10 characters).",
    path: ["tasks"],
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

export default function AttendancePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      status: undefined,
      tasks: "",
    },
  });

  const { watch } = form;
  const status = watch("status");

  async function onSubmit(values: AttendanceFormData) {
    if (!user) {
        toast({ variant: "destructive", title: "Error", description: "You must be logged in." });
        return;
    }

    setIsSubmitting(true);
    const result = await markAttendance({ ...values, employeeId: user.uid, employeeName: user.displayName || user.email || "Unknown" });
    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Mark Your Attendance</h1>
          <p className="text-muted-foreground">Let us know if you're working or on leave today.</p>
        </header>

        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold">What is your status for today?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                        >
                          <FormItem className="flex-1">
                             <RadioGroupItem value="working" id="working" className="peer sr-only" />
                             <Label htmlFor="working" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <LogIn className="mb-3 h-6 w-6" />
                                I'm Working Today
                             </Label>
                          </FormItem>
                          <FormItem className="flex-1">
                             <RadioGroupItem value="leave" id="leave" className="peer sr-only" />
                             <Label htmlFor="leave" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <LogOut className="mb-3 h-6 w-6" />
                                I'm On Leave
                            </Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {status === "working" && (
                  <FormField
                    control={form.control}
                    name="tasks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Today's Tasks</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Briefly describe the main tasks you'll be focusing on today..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting || !status}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CalendarCheck className="mr-2 h-4 w-4" />
                  )}
                  Submit Attendance
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

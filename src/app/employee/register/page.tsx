
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerEmployee } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus, PartyPopper } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const registrationSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  district: z.string().min(2, "District is required."),
  state: z.string().min(2, "State is required."),
  pincode: z.string().length(6, "Pincode must be 6 digits."),
  personalEmail: z.string().email("Please enter a valid personal email."),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface GeneratedCredentials {
  userId: string;
  password?: string;
}

export default function EmployeeRegisterPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<GeneratedCredentials | null>(null);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      district: "",
      state: "",
      pincode: "",
      personalEmail: "",
    },
  });

  async function onSubmit(values: RegistrationFormData) {
    setIsSubmitting(true);
    setCredentials(null);

    const result = await registerEmployee(values);

    if (result.success && result.userId && result.password) {
      toast({
        title: "Registration Successful!",
        description: "Your employee account has been created.",
      });
      setCredentials({ userId: result.userId, password: result.password });
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: result.message,
      });
    }
    setIsSubmitting(false);
  }

  if (credentials) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                     <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <PartyPopper className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Registration Complete!</CardTitle>
                    <CardDescription>
                        Welcome aboard! Here are your login credentials. Please save them securely.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertTitle className="text-left">Your New Credentials</AlertTitle>
                        <AlertDescription className="text-left">
                            <p className="mt-2"><strong>User ID:</strong> {credentials.userId}</p>
                            <p><strong>Password:</strong> {credentials.password}</p>
                        </AlertDescription>
                    </Alert>
                    <Button onClick={() => window.location.href = '/employee/login'} className="w-full">
                        Proceed to Login
                    </Button>
                </CardContent>
            </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Employee Registration</CardTitle>
          <CardDescription>Fill out the form below to create your employee account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Rohit Kumar" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl><Input placeholder="e.g., Godda" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl><Input placeholder="e.g., Jharkhand" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 814133" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Email ID</FormLabel>
                    <FormControl><Input type="email" placeholder="e.g., your-email@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Register Account
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

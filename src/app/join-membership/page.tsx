
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { applyForMembership } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, QrCode, User, Mail, Phone, CheckCircle, Copy } from "lucide-react";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import statesAndDistricts from "@/lib/india-states-districts.json";

const membershipSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("A valid email is required."),
  phone: z.string().min(10, "A valid 10-digit phone number is required.").max(13, "Phone number is too long."),
  state: z.string().min(1, "State is required."),
  district: z.string().min(1, "District is required."),
  utr: z.string().min(10, "A valid UTR/Transaction ID is required."),
});

type MembershipFormData = z.infer<typeof membershipSchema>;

const Step1Form = ({ form, onNext }: { form: any; onNext: () => void }) => {
  const { control, trigger, watch } = form;
  const selectedState = watch("state");
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (selectedState) {
      const stateData = statesAndDistricts.find(s => s.state === selectedState);
      setDistricts(stateData ? stateData.districts : []);
    } else {
      setDistricts([]);
    }
  }, [selectedState]);


  const handleNext = async () => {
    const isValid = await trigger(["name", "email", "phone", "state", "district"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <CardHeader>
        <CardTitle>Step 1: Your Details</CardTitle>
        <CardDescription>Please provide your basic information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField control={control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {statesAndDistricts.map(s => <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedState}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <Button onClick={handleNext} className="w-full">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </div>
  );
};

const Step2Form = ({ form }: { form: any }) => {
    const { formState: { isSubmitting } } = form;
    return (
        <div className="space-y-4">
            <CardHeader>
                <CardTitle>Step 2: Payment</CardTitle>
                <CardDescription>Scan the QR code to pay ₹1000, then enter the transaction ID.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <Image src="/qr.jpeg" alt="Payment QR Code" width={250} height={250} className="rounded-lg border p-2" />
                <div className="w-full">
                     <FormField
                        control={form.control}
                        name="utr"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>UTR / Transaction ID</FormLabel>
                            <FormControl><Input placeholder="Enter your payment transaction ID" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Application"}
                </Button>
            </CardContent>
        </div>
    );
};

const Step3Confirmation = ({ membershipId }: { membershipId: string }) => {
    const { toast } = useToast();
    const copyToClipboard = () => {
        navigator.clipboard.writeText(membershipId);
        toast({ title: "Copied!", description: "Membership ID copied to clipboard." });
    }
    return (
        <div className="text-center p-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thank you for applying!</h2>
            <p className="text-muted-foreground mb-6">Your application has been received. We will verify your payment and get back to you shortly.</p>
            <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm text-muted-foreground">Your Membership ID</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <p className="text-lg font-mono font-semibold">{membershipId}</p>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard}><Copy className="h-4 w-4" /></Button>
                </div>
            </div>
        </div>
    )
};


export default function JoinMembershipPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
    defaultValues: { name: "", email: "", phone: "", district: "", state: "", utr: "" },
  });

  const onSubmit = async (values: MembershipFormData) => {
    if(!values.utr || values.utr.length < 10) {
        form.setError("utr", { type: "manual", message: "A valid UTR/Transaction ID is required." });
        return;
    }
    const result = await applyForMembership(values);
    if (result.success && result.membershipId) {
      setMembershipId(result.membershipId);
      setCurrentStep(3);
    } else {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: result.message || "An unknown error occurred.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header variant="default" />
      <main className="flex-1 flex items-center justify-center py-16 md:py-24 px-4">
        <Card className="w-full max-w-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {currentStep === 1 && <Step1Form form={form} onNext={() => setCurrentStep(2)} />}
              {currentStep === 2 && <Step2Form form={form} />}
              {currentStep === 3 && membershipId && <Step3Confirmation membershipId={membershipId} />}
            </form>
          </Form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

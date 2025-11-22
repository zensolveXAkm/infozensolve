
"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller, useFormState } from "react-hook-form";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { applyForJob } from "@/app/actions";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Loader2, User, Home, GraduationCap, Briefcase, Sparkles, Send, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

// We keep the zod schema here for client-side validation, even though the source of truth is in actions.ts
// This provides a better UX without waiting for a server round-trip.
const formSchema = {
  // Step 1
  fullName: (val: string) => val.length >= 2,
  mobile: (val: string) => val.length >= 10,
  email: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  // Step 3
  whyShouldWeHireYou: (val: string) => val.length === 0 || val.length >= 20,
  confirmInfo: (val: boolean) => val === true,
  agreeTerms: (val: boolean) => val === true,
};


export default function ApplyJobPage({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] =  useState(0);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, formAction] = useActionState(applyForJob, { success: false, message: ""});
  
  const { isSubmitting } = useFormState();

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Application Submitted!",
        description: state.message,
      });
      router.push("/jobs");
    } else if (state.message && !state.success) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: state.message,
      });
    }
  }, [state, router, toast]);

  const steps = [
    { title: "Personal Details", icon: <User/> },
    { title: "Education & Experience", icon: <GraduationCap/> },
    { title: "Skills & Preferences", icon: <Sparkles/> },
  ];

  // Dummy form for client-side validation trigger
  const { trigger, getValues, watch } = useForm();
  const hasExperience = watch("hasExperience", "no");

  const handleNext = async () => {
    // This is a basic client-side check. The real validation happens on the server.
    const values = getValues();
    const fieldsToValidate: (keyof typeof formSchema)[] = 
      currentStep === 0 ? ["fullName", "mobile", "email"] :
      currentStep === 2 ? ["whyShouldWeHireYou", "confirmInfo", "agreeTerms"] :
      [];

    let allValid = true;
    for (const field of fieldsToValidate) {
        if (!formSchema[field](values[field])) {
            allValid = false;
            toast({ variant: 'destructive', title: 'Invalid field', description: `Please check the ${field} field.`});
            break;
        }
    }
    
    if (allValid) {
        setCurrentStep(prev => prev + 1);
    }
  };


  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">Apply for Job</CardTitle>
          <CardDescription className="text-center">Please fill out the form below to submit your application.</CardDescription>
          <div className="pt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground mt-2">Step {currentStep + 1} of {steps.length}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-8">
            <input type="hidden" name="jobId" value={params.jobId} />

            {currentStep === 0 && (
                <section className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><User /> Personal Details</h3>
                   <div className="grid md:grid-cols-2 gap-6">
                     <FormItem><FormLabel>Full Name*</FormLabel><FormControl><Input name="fullName" placeholder="John Doe" required /></FormControl></FormItem>
                     <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input name="dob" type="date" /></FormControl></FormItem>
                   </div>
                   <FormItem><FormLabel>Gender</FormLabel><Select name="gender"><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></FormItem>
                   <div className="grid md:grid-cols-2 gap-6">
                     <FormItem><FormLabel>Mobile Number*</FormLabel><FormControl><Input name="mobile" placeholder="9876543210" required /></FormControl></FormItem>
                     <FormItem><FormLabel>Email Address*</FormLabel><FormControl><Input name="email" type="email" placeholder="john.doe@example.com" required /></FormControl></FormItem>
                   </div>
                   <FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input name="whatsapp" placeholder="9876543210" /></FormControl></FormItem>

                   <h3 className="text-lg font-semibold flex items-center gap-2 pt-4"><Home /> Address Details</h3>
                   <FormItem><FormLabel>Permanent Address</FormLabel><FormControl><Textarea name="permanentAddress" placeholder="123 Main St..." /></FormControl></FormItem>
                   <FormItem><FormLabel>Current Address</FormLabel><FormControl><Textarea name="currentAddress" placeholder="456 Park Ave..." /></FormControl></FormItem>
                   <div className="grid md:grid-cols-3 gap-6">
                     <FormItem><FormLabel>City</FormLabel><FormControl><Input name="city" placeholder="New York" /></FormControl></FormItem>
                     <FormItem><FormLabel>State</FormLabel><FormControl><Input name="state" placeholder="NY" /></FormControl></FormItem>
                     <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input name="pincode" placeholder="10001" /></FormControl></FormItem>
                   </div>
                </section>
            )}
            
            {currentStep === 1 && (
                 <section className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><GraduationCap /> Education Details</h3>
                   <FormItem><FormLabel>Highest Qualification</FormLabel><FormControl><Input name="highestQualification" placeholder="e.g., B.Tech in Computer Science" /></FormControl></FormItem>
                   <div className="grid md:grid-cols-2 gap-6">
                    <FormItem><FormLabel>Year of Passing</FormLabel><FormControl><Input name="yearOfPassing" type="number" placeholder="2024" /></FormControl></FormItem>
                    <FormItem><FormLabel>University/Board</FormLabel><FormControl><Input name="university" placeholder="e.g., University of Delhi" /></FormControl></FormItem>
                   </div>
                   <FormItem><FormLabel>Specialization/Stream</FormLabel><FormControl><Input name="specialization" placeholder="e.g., Computer Science" /></FormControl></FormItem>

                  <h3 className="text-lg font-semibold flex items-center gap-2 pt-4"><Briefcase /> Work Experience</h3>
                  <FormItem className="space-y-3"><FormLabel>Do you have work experience?</FormLabel>
                      <FormControl>
                        <RadioGroup name="hasExperience" defaultValue={hasExperience} className="flex space-x-4" onValueChange={(value) => watch("hasExperience", value)}>
                          <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  {hasExperience === 'yes' && (
                    <div className="space-y-6 border-l-2 border-primary pl-4">
                      <FormItem><FormLabel>Previous Company Name</FormLabel><FormControl><Input name="previousCompany" placeholder="Tech Corp" /></FormControl></FormItem>
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormItem><FormLabel>Designation</FormLabel><FormControl><Input name="designation" placeholder="Software Engineer" /></FormControl></FormItem>
                        <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input name="yearsOfExperience" type="number" placeholder="3" /></FormControl></FormItem>
                      </div>
                    </div>
                  )}
                  <FormItem><FormLabel>LinkedIn Profile URL</FormLabel><FormControl><Input name="linkedin" placeholder="https://linkedin.com/in/johndoe" /></FormControl></FormItem>
                </section>
            )}

            {currentStep === 2 && (
                <section className="space-y-6">
                   <h3 className="text-lg font-semibold flex items-center gap-2"><Sparkles /> Skills & Preferences</h3>
                   <FormItem><FormLabel>Technical Skills</FormLabel><FormControl><Textarea name="technicalSkills" placeholder="e.g., React, Node.js, Python" /></FormControl></FormItem>
                   <FormItem><FormLabel>Soft Skills</FormLabel><FormControl><Textarea name="softSkills" placeholder="e.g., Communication, Teamwork" /></FormControl></FormItem>
                   <div className="grid md:grid-cols-2 gap-6">
                    <FormItem><FormLabel>Certifications</FormLabel><FormControl><Input name="certifications" placeholder="e.g., AWS Certified Developer" /></FormControl></FormItem>
                    <FormItem>
                      <FormLabel>Language Proficiency</FormLabel>
                      <div className="flex gap-4">
                        {['English', 'Hindi', 'Other'].map(lang => (
                          <div key={lang} className="flex flex-row items-start space-x-3 space-y-0">
                            <Checkbox name="languages" value={lang} id={`lang-${lang}`} />
                            <Label htmlFor={`lang-${lang}`} className="font-normal">{lang}</Label>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                   </div>
                   <div className="grid md:grid-cols-2 gap-6">
                    <FormItem><FormLabel>Preferred Job Role</FormLabel><FormControl><Input name="preferredRole" placeholder="e.g., Frontend Developer" /></FormControl></FormItem>
                    <FormItem><FormLabel>Preferred Location</FormLabel><FormControl><Input name="preferredLocation" placeholder="e.g., Remote, New York" /></FormControl></FormItem>
                   </div>
                   <div className="grid md:grid-cols-2 gap-6">
                    <FormItem><FormLabel>Expected Salary (LPA)</FormLabel><FormControl><Input name="expectedSalary" placeholder="e.g., 15" /></FormControl></FormItem>
                    <FormItem><FormLabel>Notice Period</FormLabel><FormControl><Input name="noticePeriod" placeholder="e.g., 30 days, Immediate" /></FormControl></FormItem>
                   </div>
                   <FormItem className="space-y-3"><FormLabel>Are you ready to relocate?</FormLabel>
                        <FormControl>
                          <RadioGroup name="readyToRelocate" defaultValue="no" className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><Label className="font-normal">Yes</Label></FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><Label className="font-normal">No</Label></FormItem>
                          </RadioGroup>
                        </FormControl>
                    </FormItem>
                   <FormItem><FormLabel>Why should we hire you?</FormLabel><FormControl><Textarea name="whyShouldWeHireYou" placeholder="Tell us about your strengths and how you can contribute to our team." className="min-h-[120px]" /></FormControl></FormItem>

                    <FormItem>
                        <FormLabel htmlFor="resume" className="flex items-center gap-2"><Upload /> Upload Resume</FormLabel>
                        <FormControl><Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" /></FormControl>
                        <FormMessage />
                    </FormItem>

                   <div className="space-y-4 pt-4">
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <Checkbox name="confirmInfo" required id="confirmInfo" />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="confirmInfo">I confirm that the information provided is true to the best of my knowledge.</Label>
                        </div>
                      </FormItem>
                       <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <Checkbox name="agreeTerms" required id="agreeTerms" />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="agreeTerms">I agree to the company’s terms and conditions.</Label>
                        </div>
                      </FormItem>
                   </div>
                </section>
            )}

            <div className="flex justify-between pt-8">
                {currentStep > 0 && (
                  <Button type="button" variant="outline" onClick={handlePrev}>
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext} className="ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Submit Application
                  </Button>
                )}
              </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    
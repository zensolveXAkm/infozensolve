
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addJob } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const jobSchema = z.object({
  title: z.string().min(3, "Title is required."),
  company: z.string().min(2, "Company name is required."),
  location: z.string().min(2, "Location is required."),
  type: z.string().min(1, "Job type is required."),
  workMode: z.string().min(1, "Work mode is required."),
  experienceMin: z.coerce.number().min(0).optional(),
  experienceMax: z.coerce.number().min(0).optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  department: z.string().min(1, "Department is required."),
  companyType: z.string().min(1, "Company type is required."),
  roleCategory: z.string().min(1, "Role category is required."),
  education: z.string().min(1, "Education is required."),
  industry: z.string().min(1, "Industry is required."),
  description: z.string().min(10, "Description is required."),
  tags: z.string().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function AddJobPage() {
  const { toast } = useToast();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      type: "",
      workMode: "",
      department: "",
      companyType: "",
      roleCategory: "",
      education: "",
      industry: "",
      description: "",
      tags: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: JobFormData) {
    console.log(values);
    const result = await addJob(values);

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
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary p-4 sm:p-6 lg:p-8">
       <header className="mb-8">
          <h1 className="text-3xl font-bold">Add a New Job</h1>
          <p className="text-muted-foreground">Fill out the form below to post a new job opportunity.</p>
        </header>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tech Innovators Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., New York, NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select work mode" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Work from office">Work from office</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a job type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Temporary">Temporary</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Engineering - Software & QA">Engineering - Software & QA</SelectItem>
                          <SelectItem value="Sales & Business Development">Sales & Business Development</SelectItem>
                          <SelectItem value="Data Science & Analytics">Data Science & Analytics</SelectItem>
                          <SelectItem value="Marketing & Communication">Marketing & Communication</SelectItem>
                          <SelectItem value="HR & Administration">HR & Administration</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Product Management">Product Management</SelectItem>
                          <SelectItem value="Design & UX">Design & UX</SelectItem>
                          <SelectItem value="Finance & Accounting">Finance & Accounting</SelectItem>
                          <SelectItem value="Customer Service & Support">Customer Service & Support</SelectItem>
                          <SelectItem value="IT & Infrastructure">IT & Infrastructure</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="experienceMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Experience (Years)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experienceMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Experience (Years)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="salaryMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Salary (LPA)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salaryMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Salary (LPA)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                      control={form.control}
                      name="companyType"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Company Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select company type" /></SelectTrigger></FormControl>
                          <SelectContent>
                              <SelectItem value="Corporate">Corporate</SelectItem>
                              <SelectItem value="Foreign MNC">Foreign MNC</SelectItem>
                              <SelectItem value="Startup">Startup</SelectItem>
                              <SelectItem value="Indian MNC">Indian MNC</SelectItem>
                              <SelectItem value="Government">Government</SelectItem>
                              <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="roleCategory"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Role Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select role category" /></SelectTrigger></FormControl>
                          <SelectContent>
                              <SelectItem value="Software Development">Software Development</SelectItem>
                              <SelectItem value="Quality Assurance and Testing">Quality Assurance and Testing</SelectItem>
                              <SelectItem value="BD / Pre Sales">BD / Pre Sales</SelectItem>
                              <SelectItem value="DevOps / SRE">DevOps / SRE</SelectItem>
                              <SelectItem value="Data Science">Data Science</SelectItem>
                              <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                              <SelectItem value="Project & Program Management">Project & Program Management</SelectItem>
                              <SelectItem value="System Design & Architecture">System Design & Architecture</SelectItem>
                               <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Education</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger></FormControl>
                          <SelectContent>
                              <SelectItem value="Any Postgraduate">Any Postgraduate</SelectItem>
                              <SelectItem value="MBA/PGDM">MBA/PGDM</SelectItem>
                              <SelectItem value="Any Graduate">Any Graduate</SelectItem>
                              <SelectItem value="B.Tech/B.E.">B.Tech/B.E.</SelectItem>
                              <SelectItem value="M.Tech">M.Tech</SelectItem>
                              <SelectItem value="MCA">MCA</SelectItem>
                              <SelectItem value="Doctorate">Doctorate</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger></FormControl>
                          <SelectContent>
                              <SelectItem value="IT Services & Consulting">IT Services & Consulting</SelectItem>
                              <SelectItem value="Software Product">Software Product</SelectItem>
                              <SelectItem value="Recruitment / Staffing">Recruitment / Staffing</SelectItem>
                              <SelectItem value="Education / Training">Education / Training</SelectItem>
                              <SelectItem value="Banking & Finance">Banking & Finance</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="E-commerce">E-commerce</SelectItem>
                              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed job description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., React, TypeScript, Next.js (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Job
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    
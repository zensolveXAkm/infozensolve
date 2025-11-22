
"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, ShieldCheck, Users, ArrowRight, Briefcase } from "lucide-react";


export default function AdminPage() {
  const { toast } = useToast();
  const [applicationCount, setApplicationCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const appsCollection = collection(db, 'applications');
        const appsSnapshot = await getDocs(appsCollection);
        setApplicationCount(appsSnapshot.size);

        const jobsCollection = collection(db, 'jobs');
        const jobsSnapshot = await getDocs(jobsCollection);
        setJobCount(jobsSnapshot.size);

      } catch (error) {
        console.error("Error fetching counts: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);


  return (
    <div className="flex min-h-screen flex-col bg-secondary p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Administrator! Here's an overview of your platform.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{applicationCount}</div>}
                    <p className="text-xs text-muted-foreground">Total job applications received</p>
                    <Button asChild variant="link" className="px-0">
                        <Link href="/admin/applications">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Jobs Posted</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{jobCount}</div>}
                    <p className="text-xs text-muted-foreground">Live and expired job listings</p>
                    <Button asChild variant="link" className="px-0">
                        <Link href="/jobs" target="_blank">View public jobs <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Post a New Job</CardTitle>
                    <CardDescription className="text-primary-foreground/80">Ready to find the next great candidate?</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button asChild variant="secondary" className="w-full">
                        <Link href="/admin/add-job">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Job
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

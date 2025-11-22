
"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp, doc, getDoc } from "firebase/firestore";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
}

interface Application {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  jobId: string;
  jobTitle?: string;
  submittedAt: Timestamp;
}

export default function ApplicationsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const appsCollection = collection(db, 'applications');
        const q = query(appsCollection, orderBy('submittedAt', 'desc'));
        const appsSnapshot = await getDocs(q);
        
        const appsData = await Promise.all(appsSnapshot.docs.map(async (appDoc) => {
          const appData = appDoc.data();
          let jobTitle = 'Unknown Job';
          try {
            if (appData.jobId) {
              const jobDocRef = doc(db, 'jobs', appData.jobId);
              const jobDocSnap = await getDoc(jobDocRef);
              if (jobDocSnap.exists()) {
                jobTitle = jobDocSnap.data().title;
              }
            }
          } catch(e) {
            console.error("Could not fetch job title for", appData.jobId);
          }
          
          return {
            id: appDoc.id,
            jobTitle,
            ...appData,
          } as Application;
        }));
        
        setApplications(appsData);

      } catch (error) {
        console.error("Error fetching data: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load job applications.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);


  return (
    <div className="flex min-h-screen flex-col bg-secondary p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-muted-foreground">View all candidates who have applied for jobs.</p>
      </header>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No applications received yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="font-medium">{app.fullName}</div>
                        <div className="text-sm text-muted-foreground">{app.email}</div>
                      </TableCell>
                      <TableCell>{app.mobile}</TableCell>
                      <TableCell>{app.jobTitle}</TableCell>
                      <TableCell>
                        {app.submittedAt ? format(app.submittedAt.toDate(), 'PP') : 'N/A'}
                      </TableCell>
                       <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/applications/${app.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    
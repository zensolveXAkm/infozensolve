
"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { verifyMembership } from "@/app/actions";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Membership {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  state: string;
  utr: string;
  status: 'pending' | 'verified';
  submittedAt: Timestamp;
}

const VerifyButton = ({ membership }: { membership: Membership }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        setIsLoading(true);
        const result = await verifyMembership({
            membershipId: membership.id,
            email: membership.email,
            password: membership.phone, // Using phone as password as requested
        });

        if (result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
        setIsLoading(false);
    }

    return (
         <Button size="sm" onClick={handleVerify} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Verify
        </Button>
    )
}

export default function MembershipsPage() {
  const { toast } = useToast();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'memberships'), orderBy('submittedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const membershipsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Membership[];
        setMemberships(membershipsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching memberships: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load membership applications.",
        });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


  return (
    <div className="flex min-h-screen flex-col bg-secondary p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Membership Applications</h1>
        <p className="text-muted-foreground">View and verify new membership applications.</p>
      </header>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : memberships.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No membership applications yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>UTR</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberships.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="font-medium">{member.name}</div>
                      </TableCell>
                       <TableCell>
                        <div className="font-medium">{member.email}</div>
                        <div className="text-sm text-muted-foreground">{member.phone}</div>
                      </TableCell>
                      <TableCell>{member.district}, {member.state}</TableCell>
                      <TableCell className="font-mono text-xs">{member.utr}</TableCell>
                      <TableCell>
                        {member.submittedAt ? format(member.submittedAt.toDate(), 'PP') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === 'verified' ? 'default' : 'secondary'}>
                          {member.status === 'verified' 
                            ? <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                            : <Clock className="mr-1 h-3 w-3" />
                          }
                          {member.status}
                        </Badge>
                      </TableCell>
                       <TableCell className="text-right">
                        {member.status === 'pending' ? (
                            <VerifyButton membership={member} />
                        ) : (
                           <span className="text-sm text-muted-foreground">Verified</span>
                        )}
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

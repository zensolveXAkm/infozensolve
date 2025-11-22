
"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Mail } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: Timestamp;
}

export default function NewsletterPage() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setIsLoading(true);
      try {
        const subscribersCollection = collection(db, 'newsletterSubscribers');
        const q = query(subscribersCollection, orderBy('subscribedAt', 'desc'));
        const subscribersSnapshot = await getDocs(q);
        
        const subscribersData = subscribersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Subscriber[];
        
        setSubscribers(subscribersData);

      } catch (error) {
        console.error("Error fetching subscribers: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load newsletter subscribers.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, [toast]);


  return (
    <div className="flex min-h-screen flex-col bg-secondary p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
        <p className="text-muted-foreground">View all users who have subscribed to your newsletter.</p>
      </header>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No subscribers yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Subscription Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <div className="font-medium">{subscriber.email}</div>
                      </TableCell>
                      <TableCell>
                        {subscriber.subscribedAt ? format(subscriber.subscribedAt.toDate(), 'PPP p') : 'N/A'}
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

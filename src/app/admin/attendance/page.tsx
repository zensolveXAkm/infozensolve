
"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, CalendarCheck, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AttendanceRecord {
  id: string;
  employeeName: string;
  status: 'working' | 'leave';
  tasks?: string;
  date: Timestamp;
}

export default function AttendancePage() {
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const attendanceCollection = collection(db, 'attendance');
        const q = query(attendanceCollection, orderBy('date', 'desc'));
        const attendanceSnapshot = await getDocs(q);
        
        const attendanceData = attendanceSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as AttendanceRecord[];
        
        setAttendance(attendanceData);

      } catch (error) {
        console.error("Error fetching attendance: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load attendance records.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [toast]);


  return (
    <div className="flex min-h-screen flex-col bg-secondary p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Employee Attendance</h1>
        <p className="text-muted-foreground">View all employee attendance records.</p>
      </header>
      <Card>
         <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
          <CardDescription>A complete history of daily attendance marked by all employees.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No attendance records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tasks for the Day</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{record.employeeName}</div>
                      </TableCell>
                       <TableCell>
                        {record.date ? format(record.date.toDate(), 'PPP') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.status === 'working' ? 'default' : 'destructive'} className="capitalize bg-green-100 text-green-800">
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-sm truncate">
                        {record.tasks || 'N/A'}
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


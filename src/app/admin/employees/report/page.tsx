
"use client";

import { useState, useEffect, Suspense } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { Loader2, User, Calendar, Phone, IndianRupee, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, formatDistanceToNow } from 'date-fns';

interface Employee {
  id: string;
  name: string;
  userId: string;
  personalEmail: string;
  status: 'active' | 'inactive';
  createdAt: Timestamp;
  lastSeen?: Timestamp;
}

interface ReportData {
  dsr: any[];
  calls: any[];
  earnings: any[];
}

function ReportContent() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('id');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [reportData, setReportData] = useState<ReportData>({ dsr: [], calls: [], earnings: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) {
      setIsLoading(false);
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Fetch Employee Details
        const empDocRef = doc(db, 'employees', employeeId);
        const empDocSnap = await getDoc(empDocRef);
        if (empDocSnap.exists()) {
          setEmployee({ id: empDocSnap.id, ...empDocSnap.data() } as Employee);
        } else {
          throw new Error("Employee not found");
        }

        // Fetch Report Data
        const fetchDataForCollection = async (colName: string) => {
          const q = query(collection(db, colName), where('employeeId', '==', employeeId), orderBy('date', 'desc'));
          const snapshot = await getDocs(q);
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };

        const [dsr, calls, earnings] = await Promise.all([
          fetchDataForCollection('dsr'),
          fetchDataForCollection('callLogs'),
          fetchDataForCollection('earnings'),
        ]);

        setReportData({ dsr, calls, earnings });

      } catch (error) {
        console.error("Error fetching employee report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [employeeId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!employee) {
    return <div className="text-center py-20">Employee not found or ID not provided.</div>;
  }

  const totalEarnings = reportData.earnings.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Performance Report</h1>
        <p className="text-muted-foreground">Detailed report for {employee.name}</p>
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><User /> Employee Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{employee.name}</p></div>
            <div><p className="text-sm text-muted-foreground">User ID</p><p className="font-medium">{employee.userId}</p></div>
            <div><p className="text-sm text-muted-foreground">Personal Email</p><p className="font-medium">{employee.personalEmail}</p></div>
            <div><p className="text-sm text-muted-foreground">Status</p><p className="font-medium capitalize">{employee.status}</p></div>
            <div><p className="text-sm text-muted-foreground">Joined</p><p className="font-medium">{format(employee.createdAt.toDate(), "PP")}</p></div>
            <div><p className="text-sm text-muted-foreground">Last Seen</p><p className="font-medium">{employee.lastSeen ? formatDistanceToNow(employee.lastSeen.toDate(), { addSuffix: true }) : 'Never'}</p></div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">DSRs Submitted</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{reportData.dsr.length}</div></CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Calls Logged</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{reportData.calls.length}</div></CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings Generated</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">₹{totalEarnings.toLocaleString('en-IN')}</div></CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Daily Status Reports (DSR)</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                 <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Travel (KM)</TableHead></TableRow></TableHeader>
                 <TableBody>
                     {reportData.dsr.length > 0 ? reportData.dsr.map(log => (
                        <TableRow key={log.id}>
                            <TableCell>{format(log.date.toDate(), "PP")}</TableCell>
                            <TableCell className="font-medium truncate max-w-md">{log.description}</TableCell>
                            <TableCell className="text-right">{log.hasTravelled && log.closingKm && log.openingKm ? (log.closingKm - log.openingKm) : 'N/A'}</TableCell>
                        </TableRow>
                     )) : <TableRow><TableCell colSpan={3} className="text-center h-24">No DSRs found.</TableCell></TableRow>}
                 </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}


export default function EmployeeReportPage() {
    return (
        <div className="flex min-h-screen flex-col bg-secondary p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <ReportContent />
            </Suspense>
        </div>
    )
}

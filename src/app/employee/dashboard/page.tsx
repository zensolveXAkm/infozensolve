
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CalendarCheck, Phone, IndianRupee, ClipboardList, ListTodo, Activity } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp,getCountFromServer } from "firebase/firestore";
import { useAuth } from "../layout";

interface DashboardCardData {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
    href: string;
}

export default function EmployeeDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        dsrCount: 0,
        callCount: 0,
        totalEarnings: 0,
        pendingTasks: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // DSR Count
                const dsrQuery = query(collection(db, "dsr"), where("employeeId", "==", user.uid));
                const dsrSnapshot = await getCountFromServer(dsrQuery);
                const dsrCount = dsrSnapshot.data().count;

                // Call Count
                const callsQuery = query(collection(db, "callLogs"), where("employeeId", "==", user.uid));
                const callsSnapshot = await getCountFromServer(callsQuery);
                const callCount = callsSnapshot.data().count;

                // Total Earnings
                const earningsQuery = query(collection(db, "earnings"), where("employeeId", "==", user.uid));
                const earningsSnapshot = await getDocs(earningsQuery);
                let totalEarnings = 0;
                earningsSnapshot.forEach(doc => { totalEarnings += doc.data().amount || 0; });

                // Pending Tasks
                const tasksQuery = query(collection(db, "tasks"), where("employeeId", "==", user.uid), where("status", "==", "pending"));
                const tasksSnapshot = await getCountFromServer(tasksQuery);
                const pendingTasks = tasksSnapshot.data().count;

                setStats({ dsrCount, callCount, totalEarnings, pendingTasks });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const cards: DashboardCardData[] = [
        { title: "Attendance", value: "Mark", icon: <CalendarCheck className="h-4 w-4 text-muted-foreground" />, description: "Mark today's attendance", href: "/employee/attendance" },
        { title: "DSR Submitted", value: stats.dsrCount, icon: <ClipboardList className="h-4 w-4 text-muted-foreground" />, description: "Your daily reports", href: "/employee/dsr"},
        { title: "Calls Made", value: stats.callCount, icon: <Phone className="h-4 w-4 text-muted-foreground" />, description: "Your logged client calls", href: "/employee/calls"},
        { title: "Total Earnings", value: `₹${stats.totalEarnings.toLocaleString('en-IN')}`, icon: <IndianRupee className="h-4 w-4 text-muted-foreground" />, description: "Earnings you generated", href: "/employee/earnings"},
        { title: "Pending Tasks", value: stats.pendingTasks, icon: <ListTodo className="h-4 w-4 text-muted-foreground" />, description: "Check your assigned tasks", href: "/employee/pending-work"},
        { title: "Overall Performance", value: "View", icon: <Activity className="h-4 w-4 text-muted-foreground" />, description: "View your performance report", href: "/employee/performance"},
    ];

    const renderCardContent = (card: DashboardCardData) => (
        <>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
            <Button asChild variant="link" className="px-0 mt-2 text-sm">
                <Link href={card.href}>{card.title === "Attendance" || card.title === "Overall Performance" ? card.description : "View Details" } <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </Button>
        </>
    );

     const renderLoadingCardContent = () => (
        <>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
            <Skeleton className="h-6 w-24 mt-4" />
        </>
    );

    return (
        <div className="flex min-h-screen flex-col bg-secondary p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl space-y-8">
                <header>
                    <h1 className="text-3xl font-bold">Employee Dashboard</h1>
                    <p className="text-muted-foreground">Welcome {user?.displayName || user?.email}! Here's your performance snapshot.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map(card => (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                {card.icon}
                            </CardHeader>
                            <CardContent>
                                {isLoading ? renderLoadingCardContent() : renderCardContent(card)}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

    

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, CalendarCheck, Phone, IndianRupee, ClipboardList, ListTodo, LogOut } from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const employeeRef = doc(db, "employees", user.uid);
        
        // Update last seen
        await setDoc(employeeRef, { lastSeen: serverTimestamp() }, { merge: true });

        // Fetch employee name from Firestore and update Auth profile
        if (!user.displayName) {
          try {
            const employeeDoc = await getDoc(employeeRef);
            if (employeeDoc.exists()) {
              const employeeData = employeeDoc.data();
              await updateProfile(user, { displayName: employeeData.name });
              const updatedUser = { ...user, displayName: employeeData.name } as User;
              setUser(updatedUser);
            } else {
               setUser(user);
            }
          } catch(error) {
              console.error("Error fetching employee details:", error);
              setUser(user);
          }
        } else {
           setUser(user);
        }
      } else {
        setUser(null);
        if (!pathname.startsWith("/employee/login")) {
            router.push("/employee/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user && !pathname.startsWith('/employee/login')) {
      return null;
  }
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}


export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/employee/login");
    } catch (error) {
      toast({ variant: "destructive", title: "Logout Failed", description: "Something went wrong." });
    }
  };
  
  return (
     <AuthProvider>
        {pathname.startsWith('/employee/login') ? (
            <>{children}</>
        ) : (
            <SidebarProvider>
              <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-6">
                            <Image src="https://github.com/akm12109/zensolve-assets/blob/main/Logo%20Zensolve.jpg?raw=true" alt="Zensolve Logo" width={32} height={32} className="rounded-md" />
                            <span>Zensolve</span>
                        </Link>
                        <SidebarTrigger />
                    </div>
                </SidebarHeader>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/employee/dashboard"}>
                        <Link href="/employee/dashboard">
                            <LayoutDashboard />
                            <span>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/employee/attendance"}>
                        <Link href="/employee/attendance">
                            <CalendarCheck />
                            <span>Attendance</span>
                        </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/employee/dsr"}>
                        <Link href="/employee/dsr">
                            <ClipboardList />
                            <span>DSR</span>
                        </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/employee/calls"}>
                        <Link href="/employee/calls">
                            <Phone />
                            <span>Calls</span>
                        </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.includes("/employee/pending-work")}>
                        <Link href="/employee/pending-work">
                            <ListTodo />
                            <span>Pending Work</span>
                        </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/employee/earnings"}>
                        <Link href="/employee/earnings">
                            <IndianRupee />
                            <span>Earnings</span>
                        </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <div className="mt-auto p-2">
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
              </Sidebar>
              <SidebarInset>
                <AuthContent>{children}</AuthContent>
              </SidebarInset>
            </SidebarProvider>
        )}
    </AuthProvider>
  );
}

function AuthContent({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    if (!user) {
        return null;
    }
    
    return <>{children}</>;
}

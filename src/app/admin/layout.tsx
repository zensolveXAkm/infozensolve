
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, PlusCircle, Users, Briefcase, Mail, LogOut, CalendarDays, Award } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
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
      router.push("/login");
    } catch (error) {
      toast({ variant: "destructive", title: "Logout Failed", description: "Something went wrong." });
    }
  };

  return (
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
            <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                <Link href="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton asChild isActive={pathname === "/admin/add-job"}>
                <Link href="/admin/add-job">
                    <PlusCircle />
                    <span>Add Job</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/applications")}>
                <Link href="/admin/applications">
                    <Users />
                    <span>Applications</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
             <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/employees")}>
                <Link href="/admin/employees">
                    <Briefcase />
                    <span>Employees</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
             <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/attendance")}>
                <Link href="/admin/attendance">
                    <CalendarDays />
                    <span>Attendance</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
             <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/memberships")}>
                <Link href="/admin/memberships">
                    <Award />
                    <span>Memberships</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton asChild isActive={pathname === "/admin/newsletter"}>
                <Link href="/admin/newsletter">
                    <Mail />
                    <span>Newsletter</span>
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
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

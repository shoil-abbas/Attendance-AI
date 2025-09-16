'use client'

import Link from "next/link"
import {
  Bell,
  CheckCircle,
  Home,
  ListTodo,
  BarChart,
  Settings,
  Shield,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Icons } from "@/components/icons"
import { UserNav } from "@/components/user-nav"
import { UserProvider, useUser } from "@/contexts/user-context"

const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", roles: ['teacher', 'student', 'admin'] },
    { href: "/attendance", icon: CheckCircle, label: "Attendance", roles: ['teacher', 'student'] },
    { href: "/tasks", icon: ListTodo, label: "Tasks", roles: ['teacher', 'student'] },
    { href: "/reports", icon: BarChart, label: "Reports", roles: ['teacher', 'admin'] },
    { href: "/admin", icon: Shield, label: "Admin", roles: ['admin'] },
    { href: "/settings", icon: Settings, label: "Settings", roles: ['teacher', 'student', 'admin'] },
]

function AppLayoutContent({ children }: { children: React.ReactNode }) {
    const { role } = useUser();
    
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <Icons.logo />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            item.roles.includes(role) && (
                                <SidebarMenuItem key={item.href}>
                                    <Link href={item.href}>
                                        <SidebarMenuButton>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            )
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="hidden md:flex">
                     <Card>
                        <CardHeader className="p-2 pt-0 md:p-4">
                            <CardTitle>Upgrade to Pro</CardTitle>
                            <CardDescription>
                                Unlock all features and get unlimited access to our support team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                            <Button size="sm" className="w-full">
                                Upgrade
                            </Button>
                        </CardContent>
                    </Card>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
                    <SidebarTrigger className="md:hidden"/>
                    <div className="w-full flex-1">
                        {/* Can add breadcrumbs here */}
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                    <UserNav />
                </header>
                <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-y-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <UserProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </UserProvider>
  )
}

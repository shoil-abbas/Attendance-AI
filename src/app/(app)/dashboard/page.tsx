'use client'
import React, { Suspense } from "react"
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Users,
} from "lucide-react"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/contexts/user-context"
import { classes, tasks } from "@/lib/mock-data"

const TeacherDashboard = React.lazy(() => import('@/components/teacher-dashboard'));
const StudentDashboard = React.lazy(() => import('@/components/student-dashboard'));
const AdminDashboard = React.lazy(() => import('@/components/admin-dashboard'));


const DashboardSkeleton = () => (
    <>
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <Skeleton className="h-4 w-24"/>
           <Skeleton className="h-4 w-4"/>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-12 mb-2"/>
            <Skeleton className="h-3 w-32"/>
        </CardContent>
      </Card>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <Skeleton className="h-4 w-24"/>
           <Skeleton className="h-4 w-4"/>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-12 mb-2"/>
            <Skeleton className="h-3 w-32"/>
        </CardContent>
      </Card>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <Skeleton className="h-4 w-24"/>
           <Skeleton className="h-4 w-4"/>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-12 mb-2"/>
            <Skeleton className="h-3 w-32"/>
        </CardContent>
      </Card>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <Skeleton className="h-4 w-24"/>
           <Skeleton className="h-4 w-4"/>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-12 mb-2"/>
            <Skeleton className="h-3 w-32"/>
        </CardContent>
      </Card>
    </div>
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
             <CardHeader>
                <Skeleton className="h-6 w-48 mb-2"/>
                <Skeleton className="h-4 w-full"/>
             </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Skeleton className="h-10 w-full"/>
                    </div>
                     <div className="flex items-center">
                        <Skeleton className="h-10 w-full"/>
                    </div>
                     <div className="flex items-center">
                        <Skeleton className="h-10 w-full"/>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
             <CardHeader>
                <Skeleton className="h-6 w-32 mb-2"/>
                 <Skeleton className="h-4 w-48"/>
             </CardHeader>
            <CardContent className="grid gap-8">
                 <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9 rounded-full"/>
                    <div className="grid gap-1">
                        <Skeleton className="h-4 w-24"/>
                        <Skeleton className="h-3 w-20"/>
                    </div>
                    <Skeleton className="h-6 w-16 ml-auto"/>
                </div>
                 <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9 rounded-full"/>
                    <div className="grid gap-1">
                        <Skeleton className="h-4 w-24"/>
                        <Skeleton className="h-3 w-20"/>
                    </div>
                    <Skeleton className="h-6 w-16 ml-auto"/>
                </div>
                 <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9 rounded-full"/>
                    <div className="grid gap-1">
                        <Skeleton className="h-4 w-24"/>
                        <Skeleton className="h-3 w-20"/>
                    </div>
                    <Skeleton className="h-6 w-16 ml-auto"/>
                </div>
            </CardContent>
        </Card>
    </div>
    </>
)


export default function Dashboard() {
  const { role, name } = useUser()

  const renderDashboard = () => {
    switch (role) {
      case 'teacher':
        return <TeacherDashboard />
      case 'student':
        return <StudentDashboard />
      case 'admin':
        return <AdminDashboard />
      default:
        return <DashboardSkeleton />
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4">
        <h1 className="text-2xl font-bold">Welcome back, {name}!</h1>
         <Suspense fallback={<DashboardSkeleton />}>
            {renderDashboard()}
        </Suspense>
    </div>
  )
}

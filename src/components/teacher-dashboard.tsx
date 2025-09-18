'use client'

import {
  Activity,
  ArrowUpRight,
  BookOpen,
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
import { classes } from "@/lib/mock-data"

export default function TeacherDashboard() {
  return (
  <>
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Classes
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">
            +2 since last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Student Attendance
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">92.5%</div>
          <p className="text-xs text-muted-foreground">
            Average for today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12</div>
          <p className="text-xs text-muted-foreground">
            Grading submissions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Absences Today</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">
            Across all classes
          </p>
        </CardContent>
      </Card>
    </div>
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>
              Your scheduled classes for today.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/attendance">
              Start Session
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.slice(0, 3).map(c => (
                 <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium">{c.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {c.subject}
                      </div>
                    </TableCell>
                    <TableCell>
                      {c.schedule.split(' ')[1]} {c.schedule.split(' ')[2]}
                    </TableCell>
                    <TableCell className="text-right">{c.students.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Recent attendance markings and alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8">
           {classes[0].students.slice(0,4).map((s, i) => (
             <div className="flex items-center gap-4" key={s.id}>
                <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={s.avatar} alt="Avatar" />
                <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{s.name}</p>
                <p className="text-sm text-muted-foreground">Marked as {i % 2 === 0 ? "Present" : "Absent"}</p>
                </div>
                <div className="ml-auto font-medium">{i % 2 === 0 ? <Badge variant="secondary" className="text-green-600">Present</Badge> : <Badge variant="destructive">Absent</Badge>}</div>
            </div>
           ))}
        </CardContent>
      </Card>
    </div>
  </>
  )
}

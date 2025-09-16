'use client'
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  ClipboardList,
  DollarSign,
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

import { useUser } from "@/contexts/user-context"
import { classes, tasks } from "@/lib/mock-data"

const TeacherDashboard = () => (
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

const StudentDashboard = () => (
    <>
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Your Attendance
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">98%</div>
          <p className="text-xs text-muted-foreground">
            This semester
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Tasks
          </CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasks.filter(t => !t.isCompleted).length}</div>
          <p className="text-xs text-muted-foreground">
            Due this week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Classes
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">
            Scheduled for today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Score</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">A-</div>
          <p className="text-xs text-muted-foreground">
            History Quiz
          </p>
        </CardContent>
      </Card>
    </div>
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
            <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
                <CardDescription>
                    Here are your pending assignments.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead className="text-right">Due Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map(task => (
                            <TableRow key={task.id}>
                                <TableCell>
                                    <div className="font-medium">{task.title}</div>
                                </TableCell>
                                <TableCell>{task.class.name}</TableCell>
                                <TableCell className="text-right">{task.dueDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Your Schedule Today</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                 {classes.slice(0, 3).map(c => (
                     <div className="flex items-center" key={c.id}>
                        <div className="flex flex-col">
                            <span className="font-medium">{c.name}</span>
                            <span className="text-sm text-muted-foreground">{c.teacher.name}</span>
                        </div>
                        <div className="ml-auto text-sm">{c.schedule.split(' ')[1]} {c.schedule.split(' ')[2]}</div>
                     </div>
                 ))}
            </CardContent>
        </Card>
    </div>
    </>
)

const AdminDashboard = () => (
    <>
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Users
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,254</div>
          <p className="text-xs text-muted-foreground">
            +50 this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Classes
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">82</div>
          <p className="text-xs text-muted-foreground">
            +5 this semester
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            System Health
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Operational</div>
          <p className="text-xs text-muted-foreground">
            All services are running
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Absence Approvals
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">
            Pending requests
          </p>
        </CardContent>
      </Card>
    </div>
    <Card>
        <CardHeader>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Recent system-wide activities.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Actor</TableHead>
                        <TableHead>Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>User Login</TableCell>
                        <TableCell>Mr. David Smith</TableCell>
                        <TableCell>2024-05-22 10:00 AM</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>Attendance Marked</TableCell>
                        <TableCell>Alice Johnson</TableCell>
                        <TableCell>2024-05-22 10:01 AM</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell>Class Created</TableCell>
                        <TableCell>Admin User</TableCell>
                        <TableCell>2024-05-22 09:30 AM</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
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
        return null
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4">
        <h1 className="text-2xl font-bold">Welcome back, {name}!</h1>
        {renderDashboard()}
    </div>
  )
}

'use client'

import {
  Activity,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Download,
} from "lucide-react"

import {
  Card,
  CardContent,
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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/user-context"
import { classes, tasks, attendance, AttendanceRecord } from "@/lib/mock-data"

export default function StudentDashboard() {
    const { user } = useUser();
    const studentAttendance = attendance.filter(a => a.student.id === user.id);

     const handleExportCsv = () => {
        const headers = ["Class", "Date", "Status", "Method"];
        const csvRows = [
            headers.join(','),
            ...studentAttendance.map((record: AttendanceRecord) => 
                [
                `"${record.class.name}"`,
                record.date,
                record.status,
                record.method
                ].join(',')
            )
        ];
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'my-attendance-report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    return (
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
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Attendance</CardTitle>
                    <Button onClick={handleExportCsv} size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Method</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentAttendance.map(att => (
                                <TableRow key={att.id}>
                                    <TableCell>{att.class.name}</TableCell>
                                    <TableCell>{att.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={att.status === 'Present' ? 'default' : 'destructive'}>{att.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{att.method}</TableCell>
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
}

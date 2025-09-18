'use client'

import { useState, useEffect } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Download } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { attendance, classes, students, AttendanceRecord } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const chartData = [
  { name: "Mon", present: 88, absent: 12 },
  { name: "Tue", present: 92, absent: 8 },
  { name: "Wed", present: 95, absent: 5 },
  { name: "Thu", present: 85, absent: 15 },
  { name: "Fri", present: 98, absent: 2 },
]

export default function ReportsPage() {
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>(attendance);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  useEffect(() => {
    let data = attendance;
    if (selectedClass !== 'all') {
      data = data.filter(record => record.class.id === selectedClass);
    }
    if (selectedStudent !== 'all') {
      data = data.filter(record => record.student.id === selectedStudent);
    }
    setFilteredAttendance(data);
  }, [selectedClass, selectedStudent]);


  const handleExportCsv = () => {
    const headers = ["Student", "Class", "Date", "Status", "Method"];
    const csvRows = [
      headers.join(','),
      ...filteredAttendance.map((record: AttendanceRecord) => 
        [
          `"${record.student.name}"`,
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
    link.setAttribute('download', 'attendance-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Attendance Reports</h1>
        <Button onClick={handleExportCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">91.5%</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Absences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Absences (Class)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">DBMS</div>
            <p className="text-xs text-muted-foreground">12 absences this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Absences (Student)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Mohd Sohil Khan</div>
            <p className="text-xs text-muted-foreground">3 absences this week</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance Trend</CardTitle>
          <CardDescription>Present vs. Absent students this week</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                />
                <Bar dataKey="present" fill="hsl(var(--primary))" name="Present" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="hsl(var(--destructive))" name="Absent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Detailed Report</CardTitle>
            <CardDescription>View and filter detailed attendance records.</CardDescription>
            <div className="flex gap-4 pt-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by student" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Method</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {filteredAttendance.map((record) => (
                    <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.student.name}</TableCell>
                    <TableCell>{record.class.name}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                        <Badge variant={record.status === 'Present' ? "secondary" : record.status === "Late" ? "outline" : "destructive"}>{record.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{record.method}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}

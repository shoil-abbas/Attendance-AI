'use client'

import { useState, useEffect } from 'react';
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Student, Teacher, Class, Admin } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

type User = (Student | Teacher | Admin) & { role: 'Student' | 'Teacher' | 'Admin' };

const addUserSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    role: z.enum(["Student", "Teacher"], { required_error: "Role is required." }),
})

const addClassSchema = z.object({
    name: z.string().min(2, { message: "Class name must be at least 2 characters." }),
    teacherId: z.string({ required_error: "Teacher is required." }),
    subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
    level: z.string({ required_error: "Level is required." }),
    schedule: z.string().min(5, { message: "Schedule must be at least 5 characters." }),
})


export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddUserOpen, setAddUserOpen] = useState(false);
    const [isAddClassOpen, setAddClassOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("users");
    const { toast } = useToast();

    const userForm = useForm<z.infer<typeof addUserSchema>>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            name: "",
        },
    })

    const classForm = useForm<z.infer<typeof addClassSchema>>({
        resolver: zodResolver(addClassSchema),
        defaultValues: {
            name: "",
            subject: "",
            schedule: "",
        },
    })

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [usersRes, classesRes] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/classes')
            ]);
            const usersData = await usersRes.json();
            const classesData = await classesRes.json();
            
            if (Array.isArray(usersData)) {
              setUsers(usersData);
              setTeachers(usersData.filter((u: User) => u.role === 'Teacher'));
            } else {
                console.warn('Fetched users data is not an array:', usersData);
                setUsers([]);
                setTeachers([]);
            }

            if (Array.isArray(classesData)) {
              setClasses(classesData);
            } else {
                console.warn('Fetched classes data is not an array:', classesData);
                setClasses([]);
            }

        } catch (error) {
            console.error("Failed to fetch admin data:", error);
            toast({
                title: "Error",
                description: "Failed to fetch data. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAdminData();
    }, []);

     const onUserSubmit = async (values: z.infer<typeof addUserSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to create user');
            }

            toast({
                title: "User Created",
                description: `${values.name} has been added as a ${values.role}.`,
            });
            
            userForm.reset();
            setAddUserOpen(false);
            await fetchAdminData();

        } catch (error: any) {
            console.error("Error creating user:", error);
            toast({
                title: "Error",
                description: error.message || "Could not create the user. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const onClassSubmit = async (values: z.infer<typeof addClassSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to create class');
            }

            toast({
                title: "Class Created",
                description: `The class ${values.name} has been added.`,
            });
            
            classForm.reset();
            setAddClassOpen(false);
            await fetchAdminData();

        } catch (error: any) {
            console.error("Error creating class:", error);
            toast({
                title: "Error",
                description: error.message || "Could not create the class. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const renderAddDialog = () => {
        if (activeTab === 'users') {
            return (
                 <Dialog open={isAddUserOpen} onOpenChange={setAddUserOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Add a new teacher or student to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...userForm}>
                            <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                                <FormField
                                    control={userForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={userForm.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Student">Student</SelectItem>
                                                    <SelectItem value="Teacher">Teacher</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                    <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Add User
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            );
        }
        if (activeTab === 'classes') {
            return (
                 <Dialog open={isAddClassOpen} onOpenChange={setAddClassOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Class</DialogTitle>
                            <DialogDescription>
                                Create a new class and assign a teacher.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...classForm}>
                            <form onSubmit={classForm.handleSubmit(onClassSubmit)} className="space-y-4">
                                <FormField control={classForm.control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Class Name</FormLabel><FormControl><Input placeholder="e.g., Algebra II" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={classForm.control} name="teacherId" render={({ field }) => (
                                    <FormItem><FormLabel>Teacher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger></FormControl>
                                        <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={classForm.control} name="subject" render={({ field }) => (
                                    <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Mathematics" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={classForm.control} name="level" render={({ field }) => (
                                     <FormItem><FormLabel>Class Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a level" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )}/>
                                <FormField control={classForm.control} name="schedule" render={({ field }) => (
                                    <FormItem><FormLabel>Schedule</FormLabel><FormControl><Input placeholder="e.g., Mon, Wed 10:00 AM" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Add Class
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            )
        }
        return null;
    }


    return (
        <div className="flex flex-col gap-4 py-4">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <Tabs defaultValue="users" onValueChange={setActiveTab}>
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="classes">Classes</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                     <div className="ml-auto flex items-center gap-2">
                        {renderAddDialog()}
                    </div>
                </div>
                <TabsContent value="users" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>Manage all teachers and students in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="hidden md:table-cell">ID</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                                        </TableRow>
                                    ) : users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {user.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{user.role}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{user.id}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                             </Table>
                        </CardContent>
                     </Card>
                </TabsContent>
                 <TabsContent value="classes" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Classes</CardTitle>
                            <CardDescription>Manage all classes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Class Name</TableHead>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Students</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                         <TableRow>
                                            <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                                        </TableRow>
                                    ) : Array.isArray(classes) && classes.map(c => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">{c.name}</TableCell>
                                            <TableCell>{c.teacher?.name || 'N/A'}</TableCell>
                                            <TableCell>{c.students?.length || 0}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                     </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

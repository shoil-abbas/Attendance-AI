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

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddUserOpen, setAddUserOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof addUserSchema>>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            name: "",
        },
    })

    const fetchAdminData = async () => {
        try {
            const [usersRes, classesRes] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/classes')
            ]);
            const usersData = await usersRes.json();
            const classesData = await classesRes.json();
            setUsers(usersData);
            setClasses(classesData);
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

     const onSubmit = async (values: z.infer<typeof addUserSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            toast({
                title: "User Created",
                description: `${values.name} has been added as a ${values.role}.`,
            });
            
            form.reset();
            setAddUserOpen(false);
            // Refetch users to update the list
            await fetchAdminData();

        } catch (error) {
            console.error("Error creating user:", error);
            toast({
                title: "Error",
                description: "Could not create the user. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col gap-4 py-4">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <Tabs defaultValue="users">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="classes">Classes</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                     <div className="ml-auto flex items-center gap-2">
                        <Dialog open={isAddUserOpen} onOpenChange={setAddUserOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add New
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                    <DialogDescription>
                                        Add a new teacher or student to the system.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
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
                                            control={form.control}
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
                                    ) : classes.map(c => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">{c.name}</TableCell>
                                            <TableCell>{c.teacher.name}</TableCell>
                                            <TableCell>{c.students.length}</TableCell>
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

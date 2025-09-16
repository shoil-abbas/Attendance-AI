'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from '@/contexts/user-context'
import { suggestTasksForAbsentTeacher, SuggestTasksForAbsentTeacherOutput } from '@/ai/flows/suggest-tasks-absent-teacher'
import { useToast } from "@/hooks/use-toast"
import { Loader2, Wand2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { tasks } from '@/lib/mock-data'
import { Checkbox } from '@/components/ui/checkbox'

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  classLevel: z.string().min(1, "Class level is required."),
  studentPreferences: z.string().optional(),
})

const TeacherTasks = () => {
    const [suggestedTasks, setSuggestedTasks] = useState<SuggestTasksForAbsentTeacherOutput['suggestedTasks'] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
            classLevel: "",
            studentPreferences: "",
        },
    })
    
    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
        setIsLoading(true)
        setSuggestedTasks(null)
        try {
            const result = await suggestTasksForAbsentTeacher(data)
            setSuggestedTasks(result.suggestedTasks)
        } catch (error) {
            console.error("Error suggesting tasks:", error)
            toast({
                title: "Error",
                description: "Could not generate task suggestions. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle>AI Task Suggester</CardTitle>
                            <CardDescription>
                                Automatically generate task ideas for a free period or absent teacher.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Mathematics" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                             <FormField
                                control={form.control}
                                name="classLevel"
                                render={({ field }) => (
                                     <FormItem>
                                        <FormLabel>Class Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a level" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="studentPreferences"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student Preferences (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., Prefers group activities, visual learners" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                Suggest Tasks
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Suggested Tasks</CardTitle>
                    <CardDescription>
                        Review the AI-generated tasks below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading && (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    {suggestedTasks && suggestedTasks.length > 0 && (
                        <div className="space-y-4">
                        {suggestedTasks.map((task, index) => (
                            <Card key={index} className="bg-secondary">
                                <CardHeader>
                                    <CardTitle className="text-base">{task.title}</CardTitle>
                                    <CardDescription>{task.type}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{task.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                        </div>
                    )}
                    {!isLoading && !suggestedTasks && (
                         <div className="flex items-center justify-center h-48">
                            <p className="text-muted-foreground">Suggestions will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

const StudentTasks = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Assignments</CardTitle>
                <CardDescription>View and manage your tasks.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-start gap-4 rounded-lg border p-4">
                            <Checkbox id={`task-${task.id}`} checked={task.isCompleted} className="mt-1" />
                            <div className="grid gap-1">
                                <label htmlFor={`task-${task.id}`} className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {task.title}
                                </label>
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                    <span>{task.class.name}</span>
                                    <span>Due: {task.dueDate}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function TasksPage() {
    const { role } = useUser()
    return (
        <div className="flex flex-col gap-4 py-4">
            <h1 className="text-2xl font-bold">Tasks</h1>
            {role === 'teacher' ? <TeacherTasks/> : <StudentTasks/>}
        </div>
    )
}

'use client'

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
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/contexts/user-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function SettingsPage() {
  const { name } = useUser()

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Update your personal information.
          </p>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="m@example.com" disabled />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
       <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Manage your notification preferences.
          </p>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                  <Label htmlFor="attendance-alerts">Attendance Alerts</Label>
                  <Switch id="attendance-alerts" defaultChecked/>
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                  <Label htmlFor="task-notifications">Task Notifications</Label>
                  <Switch id="task-notifications" defaultChecked/>
              </div>
               <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch id="email-notifications" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

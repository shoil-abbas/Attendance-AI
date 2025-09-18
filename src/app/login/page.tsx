'use client';

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useUser } from "@/contexts/user-context"

export default function LoginPage() {
  const router = useRouter()
  const { setRole } = useUser()

  const handleLogin = (role: 'teacher' | 'student' | 'admin') => {
    setRole(role);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Icons.logo />
            </div>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Select a role to log in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
                <Button onClick={() => handleLogin('teacher')}>Login as Teacher</Button>
                <Button onClick={() => handleLogin('student')} variant="secondary">Login as Student</Button>
                <Button onClick={() => handleLogin('admin')} variant="outline">Login as Admin</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

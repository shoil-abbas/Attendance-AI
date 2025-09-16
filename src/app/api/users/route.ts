import { NextResponse } from 'next/server';
import { students, teachers } from '@/lib/mock-data';

export async function GET() {
  const allUsers = [
    ...teachers.map(t => ({...t, role: 'Teacher'})),
    ...students.map(s => ({...s, role: 'Student'})),
  ];
  return NextResponse.json(allUsers);
}

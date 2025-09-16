import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { students, teachers } from '@/lib/mock-data';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("attendance-app");
    
    const usersCollection = db.collection('users');

    // Seed data if collection is empty
    const count = await usersCollection.countDocuments();
    if (count === 0) {
      const allUsers = [
        ...teachers.map(t => ({...t, role: 'Teacher'})),
        ...students.map(s => ({...s, role: 'Student'})),
      ];
      await usersCollection.insertMany(allUsers);
    }

    const allUsers = await usersCollection.find({}).toArray();
    return NextResponse.json(allUsers);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}

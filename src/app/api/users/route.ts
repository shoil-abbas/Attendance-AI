import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { students, teachers } from '@/lib/mock-data';
import { ObjectId } from 'mongodb';


async function getDb() {
    const client = await clientPromise;
    return client.db("attendance-app");
}

export async function GET() {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');

    const count = await usersCollection.countDocuments();
    if (count === 0) {
      console.log("Seeding database with initial users...");
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
    return NextResponse.json({ error: 'Error fetching users', details: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const db = await getDb();
        const body = await req.json();
        const { name, role } = body;

        if (!name || !role) {
            return NextResponse.json({ error: 'Missing name or role' }, { status: 400 });
        }
        
        const idPrefix = role === 'Teacher' ? 't' : 's';

        const newUser = {
            id: `${idPrefix}${new ObjectId().toHexString()}`,
            name,
            role,
        };

        const result = await db.collection('users').insertOne(newUser);
        
        return NextResponse.json({ ...newUser, _id: result.insertedId }, { status: 201 });
    } catch (e) {
        console.error('Error creating user:', e);
        return NextResponse.json({ error: 'Error creating user', details: (e as Error).message }, { status: 500 });
    }
}

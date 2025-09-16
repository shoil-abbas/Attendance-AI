import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { classes as mockClasses } from '@/lib/mock-data';

export async function GET() {
   try {
    const client = await clientPromise;
    const db = client.db("attendance-app");
    
    const classesCollection = db.collection('classes');

    // Seed data if collection is empty
    const count = await classesCollection.countDocuments();
    if (count === 0) {
      await classesCollection.insertMany(mockClasses);
    }

    const classes = await classesCollection.find({}).toArray();
    return NextResponse.json(classes);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching classes' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getDb() {
    const client = await clientPromise;
    return client.db("attendance-app");
}

export async function GET() {
   try {
    const db = await getDb();
    const classesCollection = db.collection('classes');
    
    // Perform aggregation to lookup teacher details
    const classes = await classesCollection.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'teacherId',
          foreignField: 'id',
          as: 'teacherInfo'
        }
      },
      {
        $unwind: {
          path: '$teacherInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          id: 1,
          name: 1,
          subject: 1,
          schedule: 1,
          level: 1,
          students: 1,
          teacher: {
            id: '$teacherInfo.id',
            name: '$teacherInfo.name'
          }
        }
      }
    ]).toArray();

    return NextResponse.json(classes);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching classes', details: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const db = await getDb();
        const body = await req.json();
        const { name, teacherId, subject, level, schedule } = body;

        if (!name || !teacherId || !subject || !level || !schedule) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const teacher = await db.collection('users').findOne({ id: teacherId, role: 'Teacher' });
        if (!teacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        const newClass = {
            id: `c${new ObjectId().toHexString()}`,
            name,
            teacherId: teacher.id,
            subject,
            level,
            schedule,
            students: [], // Initially no students
        };

        const result = await db.collection('classes').insertOne(newClass);

        return NextResponse.json({ ...newClass, _id: result.insertedId }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Error creating class', details: (e as Error).message }, { status: 500 });
    }
}


export type Student = {
  id: string;
  name: string;
};

export type Teacher = {
  id: string;
  name: string;
};

export type Admin = {
  id: string;
  name: string;
}

export type Class = {
  id: string;
  name: string;
  teacher: Teacher;
  students: Student[];
  subject: string;
  schedule: string;
  level: string;
};

export type AttendanceRecord = {
  id: string;
  student: Student;
  class: Class;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  method: 'QR' | 'Face' | 'Manual' | 'Bluetooth';
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  class: Class;
  isCompleted: boolean;
};

export type FaceVerificationRequest = {
  id: string;
  student: Student;
  photoDataUri: string;
  location: { lat: number; lon: number };
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
}

export const students: Student[] = [
  { id: 's1', name: 'Akash Sarswat' },
  { id: 's2', name: 'Mohd Anas' },
  { id: 's3', name: 'Mohd Sohil Khan' },
  { id: 's4', name: 'Arpita Yadav' },
  { id: 's5', name: 'Md Kaif' },
];

export const teachers: Teacher[] = [
  { id: 't1', name: 'Mr. Abhay Choudhary' },
  { id: 't2', name: 'Mr. Saurabh Pathak' },
];

export const classes: Class[] = [
  {
    id: 'c1',
    name: 'DAA',
    teacher: teachers[0],
    students: students.slice(0, 3),
    subject: 'Computer Science',
    schedule: 'Mon, Wed, Fri 10:00 AM',
    level: 'Intermediate',
  },
  {
    id: 'c2',
    name: 'Python',
    teacher: teachers[1],
    students: students.slice(2, 5),
    subject: 'Programming',
    schedule: 'Tue, Thu 1:00 PM',
    level: 'Beginner',
  },
  {
    id: 'c3',
    name: 'DBMS',
    teacher: teachers[0],
    students: students,
    subject: 'Database Systems',
    schedule: 'Mon, Wed 2:00 PM',
    level: 'Advanced',
  },
];

export const attendance: AttendanceRecord[] = [
  { id: 'a1', student: students[0], class: classes[0], date: '2024-05-20', status: 'Present', method: 'QR' },
  { id: 'a2', student: students[1], class: classes[0], date: '2024-05-20', status: 'Present', method: 'Face' },
  { id: 'a3', student: students[2], class: classes[0], date: '2024-05-20', status: 'Absent', method: 'Manual' },
  { id: 'a4', student: students[3], class: classes[1], date: '2024-05-21', status: 'Present', method: 'QR' },
  { id: 'a5', student: students[4], class: classes[1], date: '2024-05-21', status: 'Late', method: 'Manual' },
  { id: 'a6', student: students[0], class: classes[2], date: '2024-05-22', status: 'Present', method: 'Face' },
  { id: 'a7', student: students[0], class: classes[0], date: '2024-05-27', status: 'Absent', method: 'Manual' },
];

export const tasks: Task[] = [
  { id: 'task1', title: 'Assignment 1', description: 'Solve problems 1 through 10 on page 150.', dueDate: '2024-06-05', class: classes[0], isCompleted: false },
  { id: 'task2', title: 'Assignment 2', description: 'Solve ten pattern problems.', dueDate: '2024-06-07', class: classes[1], isCompleted: true },
  { id: 'task3', title: 'Assignment 3', description: 'Submit the full lab report from last week\'s experiment.', dueDate: '2024-06-03', class: classes[2], isCompleted: false },
];

export const faceVerificationRequests: FaceVerificationRequest[] = [
    {
        id: 'fv1',
        student: students[3],
        photoDataUri: '',
        location: { lat: 28.6542, lon: 77.2373 },
        timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
        status: 'pending',
    },
     {
        id: 'fv2',
        student: students[4],
        photoDataUri: '',
        location: { lat: 28.6542, lon: 77.2373 },
        timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
        status: 'pending',
    }
];

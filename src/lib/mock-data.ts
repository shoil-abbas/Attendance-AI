export type Student = {
  id: string;
  name: string;
  avatar: string;
};

export type Teacher = {
  id: string;
  name: string;
  avatar: string;
};

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

export const students: Student[] = [
  { id: 's1', name: 'Alice Johnson', avatar: 'https://picsum.photos/seed/1/100/100' },
  { id: 's2', name: 'Bob Williams', avatar: 'https://picsum.photos/seed/2/100/100' },
  { id: 's3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/3/100/100' },
  { id: 's4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/4/100/100' },
  { id: 's5', name: 'Ethan Garcia', avatar: 'https://picsum.photos/seed/5/100/100' },
];

export const teachers: Teacher[] = [
  { id: 't1', name: 'Mr. David Smith', avatar: 'https://picsum.photos/seed/10/100/100' },
  { id: 't2', name: 'Ms. Emily Jones', avatar: 'https://picsum.photos/seed/11/100/100' },
];

export const classes: Class[] = [
  {
    id: 'c1',
    name: 'Algebra II',
    teacher: teachers[0],
    students: students.slice(0, 3),
    subject: 'Mathematics',
    schedule: 'Mon, Wed, Fri 10:00 AM',
    level: 'Intermediate',
  },
  {
    id: 'c2',
    name: 'World History',
    teacher: teachers[1],
    students: students.slice(2, 5),
    subject: 'History',
    schedule: 'Tue, Thu 1:00 PM',
    level: 'Beginner',
  },
  {
    id: 'c3',
    name: 'Physics 101',
    teacher: teachers[0],
    students: students,
    subject: 'Science',
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
];

export const tasks: Task[] = [
  { id: 'task1', title: 'Complete Chapter 5 exercises', description: 'Solve problems 1 through 10 on page 150.', dueDate: '2024-06-05', class: classes[0], isCompleted: false },
  { id: 'task2', title: 'Essay on the Roman Empire', description: 'Write a 500-word essay on the fall of the Roman Empire.', dueDate: '2024-06-07', class: classes[1], isCompleted: true },
  { id: 'task3', title: 'Lab Report: Projectile Motion', description: 'Submit the full lab report from last week\'s experiment.', dueDate: '2024-06-03', class: classes[2], isCompleted: false },
];

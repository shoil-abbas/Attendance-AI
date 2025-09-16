# **App Name**: Attrack

## Core Features:

- User Authentication: Secure signup, login, and password reset functionality for teachers and students with email verification and optional social login via Firebase Auth.
- QR Code Attendance: Teachers generate QR codes for class sessions; students scan with their devices to mark attendance.
- AI-Powered Face Recognition: Teachers can use live camera stream or upload photos to verify student attendance using Firebase ML. System uses registered face templates for recognition. Enrolment feature has liveness check with a tool which decides whether enrolment is successful
- Automated Task Assignment: If a teacher is absent, the system automatically marks the period as free and suggests/assigns tasks using pre-authored templates and AI-generated suggestions based on subject & class level. 
- Attendance Reports: Generate and export per-student, per-class, and per-teacher attendance reports in CSV/Excel format with graphical summaries.
- Notifications: Send email and in-app push notifications (via Firebase Cloud Messaging) for attendance alerts, missing students, assigned tasks, and teacher absence notices.
- Admin Dashboard: Admin to manage users, classes, schedules, approve teacher absences, and configure AI model thresholds, and view system logs/analytics.

## Style Guidelines:

- Primary color: A calm and trustworthy blue (#4A90E2), evoking reliability and focus, reflecting the educational context.
- Background color: Light gray (#F0F4F8), offering a clean, distraction-free backdrop for content.
- Accent color: A vibrant orange (#E29A4A) to highlight key interactive elements, creating contrast and guiding user actions.
- Body and headline font: 'PT Sans' (sans-serif) for a modern, readable, and accessible feel across the platform.
- Use consistent and clear icons to represent different attendance methods and actions within the system.
- Prioritize a clean, responsive layout optimized for both desktop and mobile devices to ensure accessibility and ease of use.
- Use subtle animations and transitions to provide feedback on user interactions and guide navigation through the app.
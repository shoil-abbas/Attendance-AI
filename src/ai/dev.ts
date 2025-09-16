import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-tasks-absent-teacher.ts';
import '@/ai/flows/auto-assign-tasks-absence.ts';
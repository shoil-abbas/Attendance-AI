'use server';
/**
 * @fileOverview Automatically assigns tasks to students when a teacher is absent.
 *
 * - autoAssignTasksOnAbsence - A function that handles the task assignment process.
 * - AutoAssignTasksOnAbsenceInput - The input type for the autoAssignTasksOnAbsence function.
 * - AutoAssignTasksOnAbsenceOutput - The return type for the autoAssignTasksOnAbsence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoAssignTasksOnAbsenceInputSchema = z.object({
  classId: z.string().describe('The ID of the class.'),
  subject: z.string().describe('The subject of the class.'),
  classLevel: z.string().describe('The level of the class (e.g., elementary, middle school, high school).'),
});
export type AutoAssignTasksOnAbsenceInput = z.infer<typeof AutoAssignTasksOnAbsenceInputSchema>;

const AutoAssignTasksOnAbsenceOutputSchema = z.object({
  tasksAssigned: z.array(
    z.object({
      title: z.string().describe('The title of the assigned task.'),
      description: z.string().describe('A description of the assigned task.'),
      dueDate: z.string().describe('The due date for the task (ISO format).'),
    })
  ).describe('A list of tasks assigned to the students.'),
});
export type AutoAssignTasksOnAbsenceOutput = z.infer<typeof AutoAssignTasksOnAbsenceOutputSchema>;

export async function autoAssignTasksOnAbsence(input: AutoAssignTasksOnAbsenceInput): Promise<AutoAssignTasksOnAbsenceOutput> {
  return autoAssignTasksOnAbsenceFlow(input);
}

const taskSuggestionPrompt = ai.definePrompt({
  name: 'taskSuggestionPrompt',
  input: {schema: AutoAssignTasksOnAbsenceInputSchema},
  output: {schema: AutoAssignTasksOnAbsenceOutputSchema},
  prompt: `You are an AI assistant designed to help teachers automatically assign tasks to students when the teacher is absent.

  Given the class subject and level, suggest a list of relevant tasks (homework or quizzes) that students can work on independently.
  Each task should have a title, a brief description, and a due date within the next week.

  Class Subject: {{{subject}}}
  Class Level: {{{classLevel}}}

  Format the due date in ISO format.

  Provide at least three tasks.
  `,
});

const autoAssignTasksOnAbsenceFlow = ai.defineFlow(
  {
    name: 'autoAssignTasksOnAbsenceFlow',
    inputSchema: AutoAssignTasksOnAbsenceInputSchema,
    outputSchema: AutoAssignTasksOnAbsenceOutputSchema,
  },
  async input => {
    const {output} = await taskSuggestionPrompt(input);
    return output!;
  }
);

// Use server directive.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting tasks to students when a teacher is absent.
 *
 * It includes:
 * - suggestTasksForAbsentTeacher: The main function to trigger the task suggestion flow.
 * - SuggestTasksForAbsentTeacherInput: The input type for the suggestTasksForAbsentTeacher function.
 * - SuggestTasksForAbsentTeacherOutput: The output type for the suggestTasksForAbsentTeacher function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTasksForAbsentTeacherInputSchema = z.object({
  subject: z.string().describe('The subject of the class.'),
  classLevel: z.string().describe('The level of the class (e.g., beginner, intermediate, advanced).'),
  studentPreferences: z.string().optional().describe('Optional preferences of the students to take into account when suggesting the tasks.'),
});
export type SuggestTasksForAbsentTeacherInput = z.infer<typeof SuggestTasksForAbsentTeacherInputSchema>;

const SuggestTasksForAbsentTeacherOutputSchema = z.object({
  suggestedTasks: z.array(
    z.object({
      title: z.string().describe('The title of the suggested task.'),
      description: z.string().describe('A brief description of the task.'),
      type: z.string().describe('The type of the task (e.g., reading, exercise, project).'),
    })
  ).describe('A list of suggested tasks for the students.'),
});
export type SuggestTasksForAbsentTeacherOutput = z.infer<typeof SuggestTasksForAbsentTeacherOutputSchema>;

export async function suggestTasksForAbsentTeacher(input: SuggestTasksForAbsentTeacherInput): Promise<SuggestTasksForAbsentTeacherOutput> {
  return suggestTasksForAbsentTeacherFlow(input);
}

const suggestTasksPrompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksForAbsentTeacherInputSchema},
  output: {schema: SuggestTasksForAbsentTeacherOutputSchema},
  prompt: `You are an AI assistant tasked with suggesting learning activities for students when their teacher is absent.

  Consider the subject, class level, and student preferences when suggesting tasks. Provide a variety of task types to keep students engaged.

  Subject: {{{subject}}}
  Class Level: {{{classLevel}}}
  Student Preferences: {{{studentPreferences}}}

  Suggest a list of learning activities:
  `,
});

const suggestTasksForAbsentTeacherFlow = ai.defineFlow(
  {
    name: 'suggestTasksForAbsentTeacherFlow',
    inputSchema: SuggestTasksForAbsentTeacherInputSchema,
    outputSchema: SuggestTasksForAbsentTeacherOutputSchema,
  },
  async input => {
    const {output} = await suggestTasksPrompt(input);
    return output!;
  }
);

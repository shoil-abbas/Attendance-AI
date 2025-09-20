'use server';
/**
 * @fileOverview Verifies if an image contains a human face.
 *
 * - verifyFace - A function that handles the face verification process.
 * - VerifyFaceInput - The input type for the verifyFace function.
 * - VerifyFaceOutput - The return type for the verifyFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyFaceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  referencePhotoUri: z
    .string()
    .describe(
      "The stored reference photo of the student, as a data URI."
    ),
});
export type VerifyFaceInput = z.infer<typeof VerifyFaceInputSchema>;

const VerifyFaceOutputSchema = z.object({
  isMatch: z.boolean().describe('Whether or not the captured photo matches the reference photo.'),
  reason: z.string().describe('The reason for the decision, explaining why the faces match or not, or why verification failed.'),
});
export type VerifyFaceOutput = z.infer<typeof VerifyFaceOutputSchema>;

export async function verifyFace(input: VerifyFaceInput): Promise<VerifyFaceOutput> {
  return verifyFaceFlow(input);
}

const verifyFacePrompt = ai.definePrompt({
  name: 'verifyFacePrompt',
  input: {schema: VerifyFaceInputSchema},
  output: {schema: VerifyFaceOutputSchema},
  prompt: `You are an AI assistant for an automated attendance system. Your task is to verify if a newly captured photo of a student matches their stored reference photo.

You will be given two images:
1.  **Reference Photo**: The official, stored image of the student.
    Reference Photo: {{media url=referencePhotoUri}}
2.  **Captured Photo**: The photo just taken by the student for attendance.
    Captured Photo: {{media url=photoDataUri}}

Analyze both images and respond by setting 'isMatch' and 'reason' based on these rules:

1.  **Successful Match**: If the face in the Captured Photo is clear, unobstructed, and belongs to the same person as in the Reference Photo, set 'isMatch' to true. The reason should be "Face successfully verified."
2.  **Mismatch**: If the faces in the two photos are clearly different people, set 'isMatch' to false. The reason should be "Face does not match the registered profile."
3.  **No Clear Face**: If the Captured Photo is blurry, too dark, heavily shadowed, or the face is at an extreme angle, set 'isMatch' to false. The reason should be "Captured photo is not clear enough. Please try again in a well-lit area."
4.  **Obstruction**: If the face in the Captured Photo is partially covered by a hand, object, or excessive hair, set 'isMatch' to false. The reason should be "Face is partially obstructed. Please ensure your face is fully visible."
5.  **Multiple Faces**: If the Captured Photo contains more than one face, set 'isMatch' to false. The reason should be "Multiple faces detected. Please ensure only one person is in the frame."

Provide a response strictly following these rules. Your analysis is critical for automated attendance.`,
});

const verifyFaceFlow = ai.defineFlow(
  {
    name: 'verifyFaceFlow',
    inputSchema: VerifyFaceInputSchema,
    outputSchema: VerifyFaceOutputSchema,
  },
  async input => {
    const {output} = await verifyFacePrompt(input);
    return output!;
  }
);

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
});
export type VerifyFaceInput = z.infer<typeof VerifyFaceInputSchema>;

const VerifyFaceOutputSchema = z.object({
  hasFace: z.boolean().describe('Whether or not the image contains a human face.'),
  reason: z.string().describe('The reason for the decision, explaining why a face was or was not detected.'),
});
export type VerifyFaceOutput = z.infer<typeof VerifyFaceOutputSchema>;

export async function verifyFace(input: VerifyFaceInput): Promise<VerifyFaceOutput> {
  return verifyFaceFlow(input);
}

const verifyFacePrompt = ai.definePrompt({
  name: 'verifyFacePrompt',
  input: {schema: VerifyFaceInputSchema},
  output: {schema: VerifyFaceOutputSchema},
  prompt: `You are an AI assistant that verifies if an image contains a human face for an attendance system. Your task is to analyze the provided image and determine if there is one, and only one, clear human face present.

Image: {{media url=photoDataUri}}

Analyze the image and respond according to these rules:

1.  **Clear Face Detected**: If a single, clear, and reasonably centered human face is visible, set 'hasFace' to true. The reason should be "Human face detected."
2.  **No Face**: If there is no human face at all (e.g., an object, animal, or empty scene), set 'hasFace' to false. The reason should be "No human face was found in the image."
3.  **Not Clear Enough**: If a face is present but is blurry, too dark, heavily shadowed, too small, or at an extreme angle, set 'hasFace' to false. The reason should be "Face is not clear enough for verification. Please try again in a well-lit area."
4.  **Multiple Faces**: If more than one face is detected, set 'hasFace' to false. The reason should be "Multiple faces were detected. Please ensure only one person is in the frame."
5.  **Obstruction**: If the face is partially covered by a hand, object, or excessive hair, set 'hasFace' to false. The reason should be "Face is partially obstructed. Please ensure your face is fully visible."

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

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
  reason: z.string().describe('The reason for the decision.'),
});
export type VerifyFaceOutput = z.infer<typeof VerifyFaceOutputSchema>;

export async function verifyFace(input: VerifyFaceInput): Promise<VerifyFaceOutput> {
  return verifyFaceFlow(input);
}

const verifyFacePrompt = ai.definePrompt({
  name: 'verifyFacePrompt',
  input: {schema: VerifyFaceInputSchema},
  output: {schema: VerifyFaceOutputSchema},
  prompt: `You are an AI assistant that verifies if an image contains a human face. Your task is to analyze the provided image and determine if there is a clear, single human face present.

  Image: {{media url=photoDataUri}}

  Follow these rules strictly:
  1.  If a clear, unobstructed human face is visible, set 'hasFace' to true and set the 'reason' to "Human face detected.".
  2.  If the image is blurry, dark, or the face is too small or at a difficult angle, set 'hasFace' to false and the 'reason' to "Face is not clear enough for verification.".
  3.  If there is no human face (e.g., it's an object, animal, or empty scene), set 'hasFace' to false and 'reason' to "No human face was found in the image.".
  4.  If there are multiple faces, set 'hasFace' to false and 'reason' to "Multiple faces were detected. Please ensure only one person is in the frame.".

  Provide your response based on these rules.`,
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

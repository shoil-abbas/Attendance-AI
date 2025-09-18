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
  prompt: `You are an AI assistant that verifies if an image contains a human face.

  Analyze the provided image and determine if there is a human face present.
  The face should be reasonably clear and not an object, animal, or abstract shape.

  Image: {{media url=photoDataUri}}

  If a human face is detected, set hasFace to true. Otherwise, set it to false and provide a brief reason.`,
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

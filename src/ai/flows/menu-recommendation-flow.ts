'use server';

/**
 * @fileOverview Recommends burgers to the user based on their order history and current menu.
 *
 * - recommendBurgers - A function that recommends burgers.
 * - RecommendBurgersInput - The input type for the recommendBurgers function.
 * - RecommendBurgersOutput - The return type for the recommendBurgers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RecommendBurgersInputSchema = z.object({
  orderHistory: z
    .string()
    .describe("The user's past order history as a JSON string."),
  availableIngredients: z
    .string()
    .describe('The current available ingredients as a JSON string.'),
});
export type RecommendBurgersInput = z.infer<typeof RecommendBurgersInputSchema>;

const RecommendBurgersOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of recommended burger names.'),
});
export type RecommendBurgersOutput = z.infer<typeof RecommendBurgersOutputSchema>;

export async function recommendBurgers(input: RecommendBurgersInput): Promise<RecommendBurgersOutput> {
  return recommendBurgersFlow(input);
}

const recommendBurgersPrompt = ai.definePrompt({
  name: 'recommendBurgersPrompt',
  input: {schema: RecommendBurgersInputSchema},
  output: {schema: RecommendBurgersOutputSchema},
  prompt: `You are a burger expert. Recommend 1-3 burgers to the user based on their past order history and the currently available ingredients.

Past Order History: {{{orderHistory}}}
Available Ingredients: {{{availableIngredients}}}

Return ONLY an array of burger names.  For example: ["Classic Cheeseburger", "Bacon Deluxe", "Veggie Burger"]
`,
});

const recommendBurgersFlow = ai.defineFlow(
  {
    name: 'recommendBurgersFlow',
    inputSchema: RecommendBurgersInputSchema,
    outputSchema: RecommendBurgersOutputSchema,
  },
  async input => {
    const {output} = await recommendBurgersPrompt(input);
    return output!;
  }
);

// Smart schedule recommendation flow
'use server';

/**
 * @fileOverview This file contains the smart schedule recommendation flow.
 *
 * The smart schedule recommendation flow analyzes user's past task data and recommends optimal times for scheduling new tasks.
 *
 * - `getSmartScheduleRecommendation` - A function that handles the smart schedule recommendation process.
 * - `SmartScheduleRecommendationInput` - The input type for the `getSmartScheduleRecommendation` function.
 * - `SmartScheduleRecommendationOutput` - The return type for the `getSmartScheduleRecommendation` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartScheduleRecommendationInputSchema = z.object({
  pastTasksData: z.string().describe(
    'A stringified JSON array containing the user historical task data, including completion times, delays, and edits.'
  ),
  newTaskDescription: z.string().describe('The description of the new task to be scheduled.'),
});
export type SmartScheduleRecommendationInput = z.infer<typeof SmartScheduleRecommendationInputSchema>;

const SmartScheduleRecommendationOutputSchema = z.object({
  recommendedSchedule: z.string().describe('The recommended schedule for the new task, including time and date.'),
  reasoning: z.string().describe('The reasoning behind the recommended schedule.'),
});
export type SmartScheduleRecommendationOutput = z.infer<typeof SmartScheduleRecommendationOutputSchema>;

export async function getSmartScheduleRecommendation(input: SmartScheduleRecommendationInput): Promise<SmartScheduleRecommendationOutput> {
  return smartScheduleRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartScheduleRecommendationPrompt',
  input: {schema: SmartScheduleRecommendationInputSchema},
  output: {schema: SmartScheduleRecommendationOutputSchema},
  prompt: `You are an AI assistant that helps users schedule their tasks more effectively.

  Analyze the user's past task data to understand their work habits and task completion times.
  Consider any delays or edits made to previous tasks to estimate the time required for new tasks.

  Based on this analysis, recommend an optimal time and date for the new task.

  Past Task Data:
  {{pastTasksData}}

  New Task Description:
  {{newTaskDescription}}

  Respond with the recommended schedule and the reasoning behind it.
  Output MUST be in JSON format.
  `,
});

const smartScheduleRecommendationFlow = ai.defineFlow(
  {
    name: 'smartScheduleRecommendationFlow',
    inputSchema: SmartScheduleRecommendationInputSchema,
    outputSchema: SmartScheduleRecommendationOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);

      if (!output) {
        throw new Error('No output from prompt.');
      }

      return output;
    } catch (error: any) {
      console.error('Error in smartScheduleRecommendationFlow:', error);
      throw new Error(`Failed to get smart schedule recommendation: ${error.message}`);
    }
  }
);

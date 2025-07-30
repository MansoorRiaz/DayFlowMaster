'use server';

import type { SmartScheduleRecommendationInput } from '@/ai/flows/smart-schedule-recommendation';

export async function getAIScheduleSuggestion(data: SmartScheduleRecommendationInput) {
  try {
    // const result = await getSmartScheduleRecommendation(data);
    // return { success: true, data: result };
    await new Promise(res => setTimeout(res, 1000));
    // AI functionality is currently disabled and will not incur any costs.
    return { success: false, error: "AI suggestions are not enabled in this version." };
  } catch (error) {
    console.error("AI suggestion error:", error);
    return { success: false, error: "Failed to get AI suggestion." };
  }
}

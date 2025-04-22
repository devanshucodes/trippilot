import OpenAI from 'openai';
import { TravelPreferences } from '../types';

// WARNING: Hardcoding API keys in frontend code is insecure and for demo purposes only.
// Anyone can view this key in the browser and misuse it. NEVER use this approach in production!
const openai = new OpenAI({
  apiKey: 'sk-REPLACE_WITH_YOUR_KEY', // <-- Insert your OpenAI API key here
  dangerouslyAllowBrowser: true
});

export const generateItinerary = async (preferences: TravelPreferences): Promise<string> => {
  try {
    const promptContent = `
      Generate a detailed travel itinerary for a trip with the following preferences:
      ${JSON.stringify(preferences, null, 2)}
      
      Include the following details:
      1. A day-by-day breakdown of activities
      2. Suggested flight options with times and prices
      3. Recommended hotels with prices per night
      4. Food and dining suggestions
      5. Estimated costs for activities
      
      Format the response as a structured JSON with separate sections.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert travel planner. Create detailed, realistic itineraries based on user preferences.' },
        { role: 'user', content: promptContent }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0]?.message?.content || 'Failed to generate itinerary';
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate an itinerary. Please try again.');
  }
};
import OpenAI from 'openai';
import { TravelPreferences, Itinerary } from '../types';

// WARNING: Hardcoding API keys in frontend code is insecure and for demo purposes only.
// Anyone can view this key in the browser and misuse it. NEVER use this approach in production!
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateItinerary = async (preferences: TravelPreferences): Promise<Itinerary> => {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  }

  try {
    console.log('Generating itinerary with preferences:', preferences);
    
    const promptContent = `
      Generate a detailed travel itinerary for a trip with the following preferences:
      Destination: ${preferences.destination}
      Budget: ${preferences.budget}
      Travel Dates: ${preferences.departureDate?.toLocaleDateString()} to ${preferences.returnDate?.toLocaleDateString()}
      Number of Travelers: ${preferences.travelers}
      Interests: ${preferences.interests?.join(', ')}
      
      Please provide a detailed day-by-day itinerary in the following JSON format:
      {
        "id": "unique-id",
        "destination": "destination name",
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "flights": [
          {
            "id": "flight-id",
            "airline": "airline name",
            "departureAirport": "airport code",
            "arrivalAirport": "airport code",
            "departureTime": "YYYY-MM-DDTHH:MM:SS",
            "arrivalTime": "YYYY-MM-DDTHH:MM:SS",
            "price": number,
            "duration": "duration string",
            "stops": number
          }
        ],
        "accommodations": [
          {
            "id": "hotel-id",
            "name": "hotel name",
            "location": "location",
            "pricePerNight": number,
            "rating": number,
            "amenities": ["amenity1", "amenity2"],
            "image": "image-url"
          }
        ],
        "activities": [
          {
            "day": number,
            "date": "YYYY-MM-DD",
            "activities": [
              {
                "time": "HH:MM",
                "description": "activity description",
                "location": "location",
                "duration": "duration",
                "cost": number
              }
            ]
          }
        ]
      }
    `;

    console.log('Sending request to OpenAI...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert travel planner. Create detailed, realistic itineraries based on user preferences. Always respond with valid JSON in the exact format specified.' },
        { role: 'user', content: promptContent }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    console.log('Received response from OpenAI');
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    console.log('OpenAI response:', content);

    try {
      const parsedResponse = JSON.parse(content);
      console.log('Parsed response:', parsedResponse);
      
      // Convert string dates to Date objects
      const itinerary: Itinerary = {
        ...parsedResponse,
        startDate: new Date(parsedResponse.startDate),
        endDate: new Date(parsedResponse.endDate),
        flights: parsedResponse.flights?.map((flight: any) => ({
          ...flight,
          departureTime: new Date(flight.departureTime),
          arrivalTime: new Date(flight.arrivalTime)
        })) || [],
        accommodations: parsedResponse.accommodations || [],
        activities: parsedResponse.activities?.map((day: any) => ({
          ...day,
          date: new Date(day.date),
          activities: day.activities || []
        })) || []
      };

      console.log('Final itinerary object:', itinerary);
      return itinerary;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response that failed to parse:', content);
      throw new Error(`Failed to parse itinerary response: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate itinerary: ${error.message}`);
    }
    throw new Error('Failed to generate itinerary. Please try again.');
  }
};
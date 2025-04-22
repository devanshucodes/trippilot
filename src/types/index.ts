export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface TravelPreferences {
  destination: string;
  budget: string;
  departureDate: Date | null;
  returnDate: Date | null;
  travelers: number;
  interests: string[];
}

export interface FlightOption {
  id: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  duration: string;
  stops: number;
}

export interface HotelOption {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  image: string;
}

export interface Itinerary {
  id: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  flights: FlightOption[];
  accommodations: HotelOption[];
  activities: DailyActivity[];
}

export interface DailyActivity {
  day: number;
  date: Date;
  activities: {
    time: string;
    description: string;
    location?: string;
    duration?: string;
    cost?: number;
  }[];
}

export interface ChatState {
  messages: Message[];
  preferences: TravelPreferences;
  itinerary: Itinerary | null;
  isLoading: boolean;
  currentStep: 'initial' | 'collecting' | 'suggesting' | 'finalizing';
}
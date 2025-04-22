import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Map } from 'lucide-react';
import TravelForm from './TravelForm';
import ItineraryView from './Itinerary/ItineraryView';
import { generateItinerary } from '../services/openai';

const TravelAgent: React.FC = () => {
  const [showItinerary, setShowItinerary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState(null);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const itinerary = await generateItinerary(formData);
      setCurrentItinerary(itinerary);
      setShowItinerary(true);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      // Use mock data as fallback when API call fails
      setCurrentItinerary(mockItinerary);
      setShowItinerary(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for the demo
  const mockItinerary = {
    id: '123',
    destination: 'Paris',
    startDate: new Date('2023-06-15'),
    endDate: new Date('2023-06-22'),
    flights: [
      {
        id: 'fl1',
        airline: 'Air France',
        departureAirport: 'JFK',
        arrivalAirport: 'CDG',
        departureTime: new Date('2023-06-15T09:00:00'),
        arrivalTime: new Date('2023-06-15T22:30:00'),
        price: 850,
        duration: '8h 30m',
        stops: 0,
      },
      {
        id: 'fl2',
        airline: 'Delta Airlines',
        departureAirport: 'CDG',
        arrivalAirport: 'JFK',
        departureTime: new Date('2023-06-22T11:00:00'),
        arrivalTime: new Date('2023-06-22T14:30:00'),
        price: 890,
        duration: '9h 30m',
        stops: 1,
      },
    ],
    accommodations: [
      {
        id: 'ht1',
        name: 'Le Grand Hotel Paris',
        location: 'Rue de Rivoli, 75001 Paris',
        pricePerNight: 220,
        rating: 4.7,
        amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Room Service', 'Fitness Center'],
        image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      },
    ],
    activities: [
      {
        day: 1,
        date: new Date('2023-06-15'),
        activities: [
          {
            time: '15:00',
            description: 'Check-in at Le Grand Hotel Paris',
            location: 'Rue de Rivoli, 75001 Paris',
            duration: '30m',
          },
          {
            time: '18:00',
            description: 'Welcome dinner at Le Jules Verne',
            location: 'Eiffel Tower, Champ de Mars',
            duration: '2h',
            cost: 150,
          },
        ],
      },
      {
        day: 2,
        date: new Date('2023-06-16'),
        activities: [
          {
            time: '09:00',
            description: 'Visit the Louvre Museum',
            location: 'Rue de Rivoli, 75001 Paris',
            duration: '3h',
            cost: 15,
          },
          {
            time: '13:00',
            description: 'Lunch at Café Marly',
            location: 'Palais du Louvre',
            duration: '1h 30m',
            cost: 35,
          },
          {
            time: '15:00',
            description: 'Explore Montmartre',
            location: 'Montmartre, 75018 Paris',
            duration: '2h',
          },
          {
            time: '19:00',
            description: 'Dinner at Le Consulat',
            location: 'Montmartre',
            duration: '1h 30m',
            cost: 45,
          },
        ],
      },
      {
        day: 3,
        date: new Date('2023-06-17'),
        activities: [
          {
            time: '10:00',
            description: 'Visit Eiffel Tower',
            location: 'Champ de Mars, 5 Avenue Anatole France',
            duration: '2h',
            cost: 25,
          },
          {
            time: '13:00',
            description: 'Seine River Cruise',
            location: 'Port de la Conférence',
            duration: '1h',
            cost: 15,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-2 rounded-lg">
              <Plane size={24} />
            </div>
            <h1 className="text-2xl font-display font-semibold text-gray-800">TripPilot</h1>
          </div>
          {showItinerary && (
            <button 
              className="flex items-center space-x-2 py-2 px-4 rounded-lg transition text-primary-600 hover:bg-primary-50"
              onClick={() => setShowItinerary(false)}
            >
              <Map size={20} />
              <span>Back to Form</span>
            </button>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        {!showItinerary ? (
          <TravelForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <ItineraryView itinerary={currentItinerary || mockItinerary} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default TravelAgent;
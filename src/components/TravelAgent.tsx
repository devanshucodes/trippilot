import React, { useState } from 'react';
import type { Itinerary } from '../types';
import { motion } from 'framer-motion';
import { Plane, Map, AlertCircle } from 'lucide-react';
import TravelForm from './TravelForm';
import ItineraryView from './Itinerary/ItineraryView';
import { generateItinerary } from '../services/openai';

const TravelAgent: React.FC = () => {
  // --- UI Enhancement: Background styling ---
  // The background will be set via a gradient div below.

  const [showItinerary, setShowItinerary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Submitting form with data:', formData);
      const itinerary = await generateItinerary(formData);
      setCurrentItinerary(itinerary);
      setShowItinerary(true);
    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setCurrentItinerary(null);
      setShowItinerary(false);
    } finally {
      setIsLoading(false);
    }
  };

  // (Removed mockItinerary and related code)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 relative">
      {/* Header */}
      <header className="w-full py-6 flex items-center justify-center bg-white/80 shadow-md z-10">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-tr from-blue-400 to-purple-500 p-2 rounded-lg text-white">
            <Plane size={32} />
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-gray-800 tracking-tight">TripPilot AI</h1>
        </div>
        {showItinerary && (
          <button 
            className="ml-8 flex items-center space-x-2 py-2 px-4 rounded-lg transition text-primary-600 hover:bg-primary-50"
            onClick={() => setShowItinerary(false)}
          >
            <Map size={20} />
            <span>Back to Form</span>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center"
        >
          {!showItinerary && (
            <TravelForm onSubmit={handleFormSubmit} isLoading={isLoading} error={error} />
          )}
          {isLoading && (
            <div className="mt-8 flex flex-col items-center">
              <span className="animate-spin text-primary-500"><Map size={36} /></span>
              <span className="mt-2 text-primary-700 font-medium">Generating your itinerary...</span>
            </div>
          )}
          {error && !isLoading && (
            <div className="w-full mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="text-red-500 mt-1 mr-3" size={20} />
              <div>
                <h3 className="text-red-800 font-medium">Error Generating Itinerary</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}
          {showItinerary && !isLoading && currentItinerary && (
            <ItineraryView itinerary={currentItinerary} />
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-gray-400 bg-white/70 border-t mt-8">
        © {new Date().getFullYear()} TripPilot AI. Built with ❤️ for travel enthusiasts. Demo only – do not share API keys.
      </footer>
    </div>
  );
};

export default TravelAgent;
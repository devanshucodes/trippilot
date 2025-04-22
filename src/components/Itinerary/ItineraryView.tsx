import React from 'react';
import { Itinerary } from '../../types';
import { Calendar, MapPin, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface ItineraryViewProps {
  itinerary: Itinerary;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary }) => {
  // Format date safely with a fallback
  const formatDate = (date: Date | undefined) => {
    return date?.toLocaleDateString() || 'Date not set';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-3xl font-display font-semibold text-gray-800 mb-2">
          {itinerary.destination} Itinerary
        </h2>
        <div className="flex items-center text-gray-600 mb-4">
          <Calendar size={18} className="mr-2" />
          <span>
            {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
          </span>
        </div>
        <div className="h-40 bg-neutral-100 rounded-lg mb-6 flex items-center justify-center">
          <MapPin size={32} className="text-primary-400" />
          <span className="ml-2 text-neutral-500">Map view will appear here</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 border-b border-neutral-200 pb-2">
          Day by Day Schedule
        </h3>
        {itinerary.activities?.map((day) => (
          <div key={day.day} className="mb-6">
            <h4 className="font-medium text-lg mb-3">
              Day {day.day}: {day.date?.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) || 'Date not set'}
            </h4>
            <div className="space-y-3">
              {day.activities?.map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="w-16 text-center pr-4 border-r border-neutral-200">
                    <div className="font-medium text-primary-600">{activity.time}</div>
                  </div>
                  <div className="flex-1 pl-4">
                    <div className="font-medium">{activity.description}</div>
                    {activity.location && (
                      <div className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin size={14} className="mr-1" />
                        {activity.location}
                      </div>
                    )}
                    <div className="flex mt-2 text-sm text-gray-500">
                      {activity.duration && (
                        <div className="flex items-center mr-4">
                          <Clock size={14} className="mr-1" />
                          {activity.duration}
                        </div>
                      )}
                      {activity.cost !== undefined && (
                        <div className="flex items-center">
                          <DollarSign size={14} className="mr-1" />
                          ${activity.cost}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 border-b border-neutral-200 pb-2">
          Flight Details
        </h3>
        <div className="space-y-4">
          {itinerary.flights?.map((flight) => (
            <div
              key={flight.id}
              className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="font-medium">{flight.airline}</div>
                <div className="text-lg font-semibold">${flight.price}</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-medium">
                    {flight.departureTime?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) || 'Time not set'}
                  </div>
                  <div className="text-sm text-gray-600">{flight.departureAirport}</div>
                </div>
                <div className="flex-1 px-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">{flight.duration}</div>
                  <div className="relative">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300"></div>
                    <div className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-primary-500 transform -translate-y-1/2"></div>
                    <div className="absolute left-0 top-1/2 w-2 h-2 rounded-full bg-primary-500 transform -translate-y-1/2"></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </div>
                </div>
                <div>
                  <div className="text-lg font-medium">
                    {flight.arrivalTime?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) || 'Time not set'}
                  </div>
                  <div className="text-sm text-gray-600">{flight.arrivalAirport}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 border-b border-neutral-200 pb-2">
          Accommodation
        </h3>
        <div className="space-y-4">
          {itinerary.accommodations?.map((hotel) => (
            <div
              key={hotel.id}
              className="border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 bg-neutral-200 flex items-center justify-center">
                  {hotel.image ? (
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-neutral-400">Image not available</span>
                  )}
                </div>
                <div className="p-4 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium">{hotel.name}</h4>
                    <div className="text-lg font-semibold">${hotel.pricePerNight} <span className="text-sm font-normal text-gray-500">/ night</span></div>
                  </div>
                  <div className="flex items-center mt-2 mb-3">
                    <MapPin size={16} className="text-gray-500 mr-1" />
                    <span className="text-sm text-gray-600">{hotel.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {hotel.amenities?.map((amenity, idx) => (
                      <span key={idx} className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryView;
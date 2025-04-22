import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, Users, DollarSign, Sparkles, Globe2, Loader } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface TravelFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    destination: '',
    departureDate: null,
    returnDate: null,
    travelers: 1,
    budget: '',
    interests: [] as string[],
  });

  const interests = [
    'Culture & History',
    'Food & Dining',
    'Adventure',
    'Relaxation',
    'Shopping',
    'Nature',
    'Nightlife',
    'Art & Museums'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Globe2 size={24} />
            </div>
            <h2 className="text-3xl font-display font-semibold">Plan Your Journey</h2>
          </div>
          <p className="text-primary-100 max-w-xl">
            Let our AI travel assistant create a personalized itinerary based on your preferences.
            Experience a new way of travel planning powered by artificial intelligence.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Where would you like to go?
            </label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <DatePicker
                selected={formData.departureDate}
                onChange={(date) => setFormData({ ...formData, departureDate: date })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholderText="Select departure date"
                minDate={new Date()}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <DatePicker
                selected={formData.returnDate}
                onChange={(date) => setFormData({ ...formData, returnDate: date })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholderText="Select return date"
                minDate={formData.departureDate || new Date()}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Travelers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                min="1"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget per person
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What interests you? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-gray-300 hover:border-primary-500'
                  }`}
                  onClick={() => {
                    const newInterests = formData.interests.includes(interest)
                      ? formData.interests.filter((i) => i !== interest)
                      : [...formData.interests, interest];
                    setFormData({ ...formData, interests: newInterests });
                  }}
                >
                  <span className="text-sm">{interest}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Generating Your Perfect Trip...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate AI Travel Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TravelForm;
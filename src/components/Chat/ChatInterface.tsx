import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import UserInput from './UserInput';
import { Message } from '../../types';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, DollarSign } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  preferences: any;
  onSendMessage: (message: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  preferences,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Preference summary bar */}
      {Object.keys(preferences).length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="bg-primary-50 p-3 flex flex-wrap items-center gap-3 text-sm border-b border-primary-100"
        >
          {preferences.destination && (
            <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
              <MapPin size={16} className="text-primary-600 mr-1" />
              <span>{preferences.destination}</span>
            </div>
          )}
          {preferences.departureDate && preferences.returnDate && (
            <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
              <Calendar size={16} className="text-primary-600 mr-1" />
              <span>
                {new Date(preferences.departureDate).toLocaleDateString()} - {new Date(preferences.returnDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {preferences.travelers && (
            <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
              <Users size={16} className="text-primary-600 mr-1" />
              <span>{preferences.travelers} travelers</span>
            </div>
          )}
          {preferences.budget && (
            <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
              <DollarSign size={16} className="text-primary-600 mr-1" />
              <span>${preferences.budget}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-neutral-50">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLatest={index === messages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* User input */}
      <UserInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
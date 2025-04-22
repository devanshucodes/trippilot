import React from 'react';
import { MessageSquare, User } from 'lucide-react';
import { Message } from '../../types';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full mb-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`flex max-w-[80%] ${
          isAssistant
            ? 'bg-white text-gray-800 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
            : 'bg-primary-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
        } p-4 shadow-md`}
      >
        <div className="flex-shrink-0 mr-3">
          {isAssistant ? (
            <div className="bg-primary-100 p-2 rounded-full">
              <MessageSquare size={20} className="text-primary-600" />
            </div>
          ) : (
            <div className="bg-primary-200 p-2 rounded-full">
              <User size={20} className="text-primary-700" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">
            {isAssistant ? 'TripPilot' : 'You'}
          </p>
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          <p className="text-xs mt-2 opacity-70">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
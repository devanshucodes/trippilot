import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Loader } from 'lucide-react';

interface UserInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const UserInput: React.FC<UserInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4 rounded-b-lg shadow-md"
    >
      <div className="flex items-end">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about planning your trip..."
          className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[50px] max-h-[120px] transition-all duration-200 ease-in-out"
          disabled={isLoading || disabled}
          rows={1}
        />
        <button
          type="submit"
          className={`ml-2 bg-primary-600 text-white rounded-full p-3 transition-all duration-200 ${
            isLoading || disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary-700'
          }`}
          disabled={isLoading || disabled || !message.trim()}
        >
          {isLoading ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </form>
  );
};

export default UserInput;
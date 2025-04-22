import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, Loader, CheckCircle, X } from 'lucide-react';
import { checkApiKeyValidity } from '../../services/openai';

interface ApiKeyModalProps {
  onApiKeySubmit: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an OpenAI API key');
      return;
    }

    setError('');
    setIsValidating(true);

    try {
      const isValid = await checkApiKeyValidity(apiKey);
      if (isValid) {
        setIsValid(true);
        setTimeout(() => {
          onApiKeySubmit(apiKey);
        }, 1000);
      } else {
        setError('Invalid API key. Please check and try again.');
      }
    } catch (err) {
      setError('Error validating API key. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-primary-600 p-6 text-white relative">
          <div className="absolute top-0 right-0 left-0 h-20 bg-primary-500 rounded-br-[100px] -z-10"></div>
          <div className="mb-3 inline-flex p-3 bg-white bg-opacity-20 rounded-full">
            <Key size={24} />
          </div>
          <h2 className="text-2xl font-display font-medium mb-2">Enter Your OpenAI API Key</h2>
          <p className="text-primary-100">
            We need your OpenAI API key to power the AI travel assistant. Your key is stored locally in your browser and is never sent to our servers.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-gray-400" />
              </div>
              <input
                type="password"
                id="apiKey"
                placeholder="sk-..."
                className={`pl-10 w-full py-2 px-4 border ${
                  error ? 'border-error-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
              <AnimatePresence>
                {isValidating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Loader size={16} className="text-primary-500 animate-spin" />
                  </motion.div>
                )}
                {isValid && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <CheckCircle size={16} className="text-success-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-error-600 flex items-center"
              >
                <X size={14} className="mr-1" /> {error}
              </motion.p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Don't have an API key?{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                Get one from OpenAI
              </a>
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isValidating || isValid}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition ${
              isValidating || isValid
                ? 'bg-primary-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isValidating ? 'Validating...' : isValid ? 'API Key Valid!' : 'Submit API Key'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ApiKeyModal;
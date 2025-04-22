import { useState, useCallback, useEffect } from 'react';
import { Message, TravelPreferences, Itinerary, ChatState } from '../types';
import { generateChatResponse, generateItinerary } from '../services/openai';

const initialMessage: Message = {
  id: '1',
  role: 'assistant',
  content: "Hi there! I'm your AI travel assistant. I can help you plan your perfect trip and find great flights and hotels based on your preferences. To get started, could you tell me where you'd like to go and when you're planning to travel?",
  timestamp: new Date(),
};

const useChatConversation = () => {
  const [state, setState] = useState<ChatState>({
    messages: [initialMessage],
    preferences: {},
    itinerary: null,
    isLoading: false,
    currentStep: 'initial',
  });

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, newMessage],
    }));

    return newMessage;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    addMessage({ role: 'user', content });
    
    // Set loading state
    setState(prevState => ({ ...prevState, isLoading: true }));
    
    try {
      // Get AI response
      const aiResponse = await generateChatResponse(
        [...state.messages, { id: 'temp', role: 'user', content, timestamp: new Date() }],
        state.preferences
      );
      
      // Add AI response
      addMessage({ role: 'assistant', content: aiResponse });
      
      // Update preferences based on conversation
      // In a real app, you would use more sophisticated NLP to extract preferences
      // For this demo, we'll use a simplified approach
      const newPreferences = { ...state.preferences };
      
      // Simple keyword matching to extract preferences
      if (content.toLowerCase().includes('budget')) {
        const budgetMatch = content.match(/(\$\d+|\d+ dollars)/i);
        if (budgetMatch) {
          const budget = parseInt(budgetMatch[0].replace(/\$|\s|dollars/gi, ''));
          newPreferences.budget = budget;
        }
      }
      
      if (content.toLowerCase().includes('people') || content.toLowerCase().includes('travelers')) {
        const travelerMatch = content.match(/(\d+)\s*(people|travelers|adults|persons)/i);
        if (travelerMatch) {
          newPreferences.travelers = parseInt(travelerMatch[1]);
        }
      }
      
      // Update destination if mentioned
      const destinations = [
        'paris', 'london', 'tokyo', 'new york', 'rome', 'bali', 'barcelona',
        'sydney', 'dubai', 'bangkok', 'singapore', 'hong kong', 'istanbul',
        'amsterdam', 'berlin', 'venice', 'prague', 'rio', 'lisbon', 'vienna'
      ];
      
      for (const destination of destinations) {
        if (content.toLowerCase().includes(destination)) {
          newPreferences.destination = destination.charAt(0).toUpperCase() + destination.slice(1);
          break;
        }
      }
      
      // Update state with new preferences
      setState(prevState => ({ 
        ...prevState, 
        preferences: newPreferences,
        isLoading: false,
        currentStep: Object.keys(newPreferences).length >= 3 ? 'suggesting' : 'collecting',
      }));
      
    } catch (error) {
      console.error('Error in chat conversation:', error);
      addMessage({ 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error while processing your request. Please try again.' 
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  }, [state.messages, state.preferences, addMessage]);

  const updatePreferences = useCallback((newPreferences: Partial<TravelPreferences>) => {
    setState(prevState => ({
      ...prevState,
      preferences: { ...prevState.preferences, ...newPreferences },
    }));
  }, []);

  const generateTripItinerary = useCallback(async () => {
    setState(prevState => ({ ...prevState, isLoading: true }));
    
    try {
      const itineraryResponse = await generateItinerary(state.preferences);
      
      // Add AI response with itinerary
      addMessage({ 
        role: 'assistant', 
        content: `I've prepared an itinerary based on your preferences. Here it is:\n\n${itineraryResponse}` 
      });
      
      // In a real app, you would parse the JSON response and set the itinerary
      // For this demo, we'll just simulate it
      setState(prevState => ({ 
        ...prevState, 
        isLoading: false,
        currentStep: 'finalizing',
      }));
    } catch (error) {
      console.error('Error generating itinerary:', error);
      addMessage({ 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error while generating your itinerary. Please try again.' 
      });
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  }, [state.preferences, addMessage]);

  const reset = useCallback(() => {
    setState({
      messages: [initialMessage],
      preferences: {},
      itinerary: null,
      isLoading: false,
      currentStep: 'initial',
    });
  }, []);

  return {
    messages: state.messages,
    preferences: state.preferences,
    itinerary: state.itinerary,
    isLoading: state.isLoading,
    currentStep: state.currentStep,
    sendMessage,
    updatePreferences,
    generateTripItinerary,
    reset,
  };
};

export default useChatConversation;

import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface ThinkingAssistantProps {
  context: string;
}

const ThinkingAssistant: React.FC<ThinkingAssistantProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const askAI = async () => {
    if (!query.trim()) return;
    setIsThinking(true);
    setResponse('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Context: ${context}\n\nUser Question: ${query}\n\nAs a brilliant detective assistant, please provide a deep logical analysis of this case clue or situation.`,
        config: {
          thinkingConfig: { thinkingBudget: 32768 }
        },
      });
      
      setResponse(res.text || 'Thinking complete, but no output was generated.');
    } catch (error) {
      console.error(error);
      setResponse('Analysis failed. Perhaps the case is too complex even for a super-detective...');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="mt-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-brown-600 underline font-handwriting text-lg hover:text-pink-600 transition-colors"
      >
        {isOpen ? 'Close Case Analysis' : '🔍 Need Case Analysis? (AI Thinking)'}
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-amber-50 border-2 border-brown-300 rounded-lg shadow-inner">
          <p className="text-sm font-bold text-brown-800 mb-2 italic">Thinking Detective Assistant:</p>
          <textarea
            className="w-full p-2 border border-brown-200 rounded-md text-sm mb-2 focus:ring-1 focus:ring-brown-400 outline-none"
            placeholder="Ask me to analyze the logic of this clue..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={2}
          />
          <button
            onClick={askAI}
            disabled={isThinking}
            className="bg-brown-600 text-white px-4 py-1 rounded-md text-sm hover:bg-brown-700 transition-colors disabled:opacity-50"
          >
            {isThinking ? 'AI is Thinking Deeply...' : 'Analyze Deeply'}
          </button>
          
          {response && (
            <div className="mt-4 p-3 bg-white border border-brown-100 rounded-md text-sm text-gray-800 max-h-48 overflow-y-auto">
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThinkingAssistant;

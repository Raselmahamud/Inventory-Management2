import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, Sparkles } from 'lucide-react';
import { getInventoryInsights } from '../services/geminiService';
import { Product } from '../types';

interface AIAssistantProps {
  products: Product[];
  onFilterApply: (filter: Partial<Product> | null) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ products, onFilterApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your inventory assistant. Ask me about stock levels, low items, or to find specific products.' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await getInventoryInsights(userMsg, products);

    setMessages(prev => [...prev, { role: 'ai', text: response.text }]);
    
    if (response.filter) {
      onFilterApply(response.filter);
    } else {
        // If no filter returned, maybe clear filters if the user intent was general, 
        // but for now we only apply explicit filters. 
        // Ideally we'd have a 'clear' intent too.
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center gap-2 ${isOpen ? 'scale-0' : 'scale-100'} bg-indigo-600 text-white hover:bg-indigo-700`}
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 max-w-[90vw] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 transition-all duration-300 z-50 flex flex-col ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
           style={{ height: '500px' }}>
        
        {/* Header */}
        <div className="p-4 bg-indigo-600 rounded-t-2xl flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h3 className="font-semibold">NexStock AI</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 p-1 rounded-full">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about inventory..."
              className="flex-1 bg-gray-100 dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
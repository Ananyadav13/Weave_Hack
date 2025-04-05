"use client";


import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Award, Coins } from 'lucide-react';

export default function GeminiClient() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    // Add user message to conversation
    const newConversation = [
      ...conversation,
      { role: 'user', content: prompt }
    ];
    
    setConversation(newConversation);
    setPrompt('');
    
    try {
      // Simulate API call to Gemini
      setTimeout(() => {
        // Generate a skill-platform focused response
        let mockResponse;
        
        if (prompt.toLowerCase().includes('skill') || prompt.toLowerCase().includes('exchange')) {
          mockResponse = `I found several skills that might interest you on Weave:\n\n**Web Development** (★★★★★)\nOffered by Sarah K. - 230 successful exchanges\nCan be exchanged for: UI/UX Design, Digital Marketing, or 500 tokens\n\n**Data Analysis** (★★★★☆)\nOffered by Miguel L. - 124 successful exchanges\nCan be exchanged for: Python Programming, Content Writing, or 350 tokens\n\n**Photography** (★★★★★)\nOffered by Jamie T. - 89 successful exchanges\nCan be exchanged for: Video Editing, Graphic Design, or 400 tokens\n\nWould you like me to help you make an exchange offer?`;
        } else if (prompt.toLowerCase().includes('token') || prompt.toLowerCase().includes('coin')) {
          mockResponse = `Your current token balance: **1,250 Weave Tokens**\n\nHere are some ways you can earn more tokens:\n\n1. Complete your skill verification (+100 tokens)\n2. Participate in community challenges (+50-200 tokens)\n3. Receive positive reviews on skill exchanges (+25 tokens each)\n4. Refer new members (+100 tokens per referral)\n\nPopular skills you can purchase with tokens:\n- Python Programming (800 tokens)\n- Logo Design (650 tokens)\n- SEO Optimization (750 tokens)\n- Language Lessons (500 tokens/session)\n\nWould you like me to recommend the best ways to utilize your current token balance?`;
        } else {
          mockResponse = `Welcome to Weave, the skill sharing community!\n\nI can help you:\n\n- Discover skills offered by other members\n- Match your skills with compatible exchange opportunities\n- Track your token balance and transactions\n- Recommend skill improvement resources\n- Facilitate skill exchanges between members\n\nWhat skill are you looking to share or acquire today?`;
        }
        
        // Add AI response to conversation
        setConversation([
          ...newConversation,
          { role: 'assistant', content: mockResponse }
        ]);
        
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  // Function to render content with proper formatting
  const formatContent = (content) => {
    // Handle bold text formatting
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Split content by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const firstLineEnd = part.indexOf('\n');
        const language = part.slice(3, firstLineEnd).trim();
        const code = part.slice(firstLineEnd + 1, -3).trim();
        
        return (
          <div key={index} className="w-full my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">{language || 'code'}</span>
              <button 
                className="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 text-sm font-medium transition-colors"
                onClick={() => navigator.clipboard.writeText(code)}
              >
                Copy
              </button>
            </div>
            <pre className="bg-white dark:bg-gray-900 p-4 overflow-x-auto text-sm">
              <code>{code}</code>
            </pre>
          </div>
        );
      } else {
        // Process regular text with line breaks and handle bold formatting
        return part.split('\n').map((line, i) => {
          // Handle lists with dashes or numbers
          if (line.match(/^- /)) {
            return (
              <div key={`${index}-${i}`} className="flex items-start mb-2">
                <span className="mr-2 text-violet-500">•</span>
                <p className="text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: line.substring(2) }}></p>
              </div>
            );
          } else if (line.match(/^\d+\. /)) {
            const num = line.match(/^\d+/)[0];
            return (
              <div key={`${index}-${i}`} className="flex items-start mb-2">
                <span className="mr-2 text-violet-500 min-w-6 text-right">{num}.</span>
                <p className="text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: line.substring(num.length + 2) }}></p>
              </div>
            );
          } else if (line.match(/^\*\*.*\*\*$/)) {
            // Section headers (full bold lines)
            return (
              <h4 key={`${index}-${i}`} className="font-semibold text-lg mb-2 text-violet-700 dark:text-violet-400" dangerouslySetInnerHTML={{ __html: line }}></h4>
            );
          } else {
            return (
              <p key={`${index}-${i}`} className="mb-3 text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: line || ' ' }}></p>
            );
          }
        });
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 max-w-4xl mx-auto pt-22">
      {/* Platform info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-violet-600" />
          <span className="text-gray-700 dark:text-gray-300 text-sm">Skills Available: 2,483</span>
        </div>
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-amber-500" />
          <span className="text-gray-700 dark:text-gray-300 text-sm">Your Tokens: 1,250</span>
        </div>
      </div>

      {/* Chat container */}
      <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="h-[calc(100vh-280px)] overflow-y-auto p-6">
          {conversation.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400 max-w-md">
                <h3 className="text-lg font-medium mb-2">Welcome to Weave</h3>
                <p>Ask about skills to exchange, check your token balance, or discover new learning opportunities</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`${message.role === 'user' ? 'justify-end flex' : 'justify-start flex'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-violet-600 text-white'
                        : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                        <span className="mr-1">Weave Assistant</span>
                        <span className="text-xs bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 px-2 py-0.5 rounded-full">Skill Matcher</span>
                      </div>
                    )}
                    <div className={`${message.role === 'assistant' ? 'text-gray-800 dark:text-gray-200' : ''}`}>
                      {message.role === 'assistant' 
                        ? formatContent(message.content)
                        : message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
                    <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about skills, exchanges, or token balances..."
          className="w-full px-5 py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-12 text-gray-800 dark:text-gray-200"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-violet-600 text-white p-2 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
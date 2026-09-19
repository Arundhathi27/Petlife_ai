import React, { useState, useRef, useEffect } from 'react';
import { usePet } from '../context/PetContext';
import { Send, Bot, User, Sparkles, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import Button from '../components/common/Button';

export const AskPetLifeAI = () => {
  const { pet, events } = usePet();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const petName = pet?.name || 'your pet';

  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome_msg',
      sender: 'ai',
      text: pet 
        ? `Hi! I'm your PetLife AI assistant. I'm ready to answer questions about ${pet.name} using your recorded health timeline events.`
        : "Hi! Please create a pet profile first so I can assist you with your pet's records.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const questionText = (textToSend || inputText).trim();
    if (!questionText || loading) return;

    setError(null);
    setInputText('');

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    if (!pet) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: "Please create a pet profile first so I can analyze your pet's health records.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 300);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        pet: {
          id: pet.id,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          currentWeight: pet.currentWeight,
          previousWeight: pet.previousWeight,
          weightUnit: pet.weightUnit || 'kg'
        },
        healthEvents: (events || []).map(evt => ({
          id: evt.id,
          date: evt.date || evt.displayDate,
          displayDate: evt.displayDate,
          type: evt.type || evt.category,
          category: evt.category,
          title: evt.title,
          subtitle: evt.subtitle,
          details: evt.details,
          severity: evt.severity,
          location: evt.location,
          provider: evt.provider
        })),
        question: questionText
      };

      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('PetLife AI is temporarily unavailable. Please try again.');
      }

      const data = await response.json();

      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.answer || `I don't have that information in ${petName}'s recorded health data.`,
        disclaimer: data.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('[AskPetLifeAI Error]:', err.message);
      setError('PetLife AI is temporarily unavailable. Please try again.');
      setMessages(prev => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: "PetLife AI is temporarily unavailable. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'ai',
        text: pet 
          ? `Conversation cleared. What else would you like to ask about ${pet.name}'s health records?`
          : "Conversation cleared. Please sign in or create a pet profile to start asking questions.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setError(null);
  };

  const suggestedPrompts = pet ? [
    `What's happened to ${pet.name} recently?`,
    `What's ${pet.name}'s current recorded weight?`,
    `Has ${pet.name} had any vomiting recorded?`,
    `Are there any repeated events in the timeline?`,
    `Does ${pet.name} have any medication recorded?`,
    `What's changed recently?`
  ] : [
    "How do I create a pet profile?",
    "What features are available in PetLife AI?",
    "How does timeline tracking work?"
  ];

  return (
    <div className="pb-24 max-w-4xl mx-auto flex flex-col justify-between space-y-4 min-h-[calc(100vh-140px)]">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-950 rounded-3xl p-5 text-white shadow-card flex items-center justify-between shrink-0 border border-violet-700/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/30 text-amber-300 flex items-center justify-center border border-violet-400/40 backdrop-blur-md shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>Ask PetLife AI</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </h2>
            <p className="text-xs text-violet-200">Grounded strictly in {petName}'s recorded health events ({events?.length || 0} logged)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-violet-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="space-y-2 shrink-0">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Suggested Questions</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          {suggestedPrompts.map((q, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSend(q)}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-violet-50 text-slate-700 hover:text-violet-900 text-xs font-semibold whitespace-nowrap border border-slate-200/80 shadow-soft transition-all active:scale-95 disabled:opacity-50"
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft space-y-4 overflow-y-auto min-h-[360px] max-h-[550px]">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-9 h-9 rounded-2xl bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                  isAI
                    ? 'bg-amber-50/70 text-slate-800 border border-amber-100 rounded-tl-sm'
                    : 'bg-emerald-600 text-white font-medium rounded-tr-sm shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
                
                {msg.disclaimer && (
                  <p className="text-[11px] text-amber-800/80 pt-1.5 border-t border-amber-200/60 font-medium italic">
                    {msg.disclaimer}
                  </p>
                )}

                <span className={`text-[10px] block text-right font-medium ${isAI ? 'text-slate-400' : 'text-emerald-200'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {!isAI && (
                <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-violet-600 text-xs font-semibold p-2 bg-violet-50/50 rounded-2xl w-fit">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>PetLife AI is analyzing {petName}'s health records...</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3 pt-1"
      >
        <input
          type="text"
          disabled={loading || !pet}
          placeholder={pet ? `Ask anything about ${pet.name}'s symptoms, weight, or health timeline...` : "Create a pet profile to start asking questions."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-5 py-3.5 rounded-2xl bg-white border border-slate-200/80 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-soft disabled:bg-slate-100 disabled:cursor-not-allowed"
        />
        <Button
          type="submit"
          disabled={loading || !inputText.trim() || !pet}
          variant="accent"
          className="shrink-0 p-3.5 sm:px-6 sm:py-3.5 rounded-2xl shadow-violet-600/30 disabled:opacity-50"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline ml-1 font-bold">Send</span>
        </Button>
      </form>
    </div>
  );
};

export default AskPetLifeAI;

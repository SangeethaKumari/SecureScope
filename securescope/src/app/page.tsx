'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  citation?: string | null;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Hello! I am SecureScope, your specialized Access Control Policy agent. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: 'ai', content: `Error: ${data.error}` }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: data.answer, citation: data.citation },
        ]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: "Sorry, I encountered an error connecting to the service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center p-4 md:p-8">
      <div className="mesh-bg" />

      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">SecureScope</h1>
            <p className="text-xs text-indigo-300 font-medium uppercase tracking-widest">Compliance Q&A Agent</p>
          </div>
        </div>
        <div className="hidden md:block px-4 py-1.5 glass-panel text-xs text-indigo-200 border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2 animate-pulse" />
          Connected to Senso API
        </div>
      </header>

      {/* Chat Container */}
      <div className="w-full max-w-4xl flex-1 glass-panel flex flex-col overflow-hidden shadow-2xl relative z-10">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${msg.role === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-ai text-indigo-50'
                }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.citation && (msg.role === 'ai') && (
                  <div className="mt-3 pt-3 border-t border-white/5 text-[10px] md:text-xs text-indigo-300 italic">
                    <span className="font-bold uppercase text-[9px] mr-1 opacity-70">Context Match:</span>
                    &ldquo;{msg.citation.substring(0, 150)}...&rdquo;
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="chat-bubble-ai p-4 rounded-2xl flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 md:p-6 bg-white/5 border-t border-white/5">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the Access Control Policy..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 pr-14 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-all text-sm md:text-base"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 w-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-indigo-600/20"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-[10px] text-center text-white/20 uppercase tracking-[0.2em]">
            Strict Compliance Mode Active • Policy v1.0
          </p>
        </form>
      </div>

      {/* Background Orbs */}
      <div className="fixed top-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] -z-1" />
      <div className="fixed bottom-1/4 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] -z-1" />
    </main>
  );
}

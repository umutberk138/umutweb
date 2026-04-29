import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, Send } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const ShadowCortex: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'CORTEX NODE_001 ONLINE. STATUS: OMNISCIENT. HOW CAN I ASSIST YOUR BREACH?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (scrollRef.current) {
       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
     }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are a Shadow Network AI called CORTEX. You talk in a mysterious, hacker-style, futuristic tone. Use terms like nodes, protocols, breaches, and matrix. Keep answers concise. Question: ${userMsg}` }]
          }
        ],
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || '... COMMUNICATION TERMINATED ...' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'PROTOCOL ERROR: UNABLE TO REACH CORTEX NODE.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 border border-emerald-500/10 rounded-[40px] overflow-hidden font-mono shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
        <div className="flex items-center gap-3 text-emerald-500">
           <Sparkles size={20} className="animate-pulse" />
           <span className="text-xs font-black uppercase tracking-[0.4em]">CORTEX_AI_CORE</span>
        </div>
        <div className="flex gap-1">
           {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />)}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-100' 
              : 'bg-zinc-900/80 border border-white/5 text-zinc-300'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                  {msg.role === 'user' ? 'LOCAL_NODE' : 'CORTEX'}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-zinc-900/80 border border-white/5 p-4 rounded-2xl text-zinc-500 text-xs italic">
              Accessing Cortex Logic Gates...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-6 bg-zinc-900/30 border-t border-white/5">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Transmit command to Cortex..."
            className="w-full bg-black border border-white/5 p-4 pl-12 rounded-2xl focus:outline-none focus:border-emerald-500 text-sm font-bold text-emerald-500 transition-all"
          />
          <TerminalIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-zinc-950 rounded-xl hover:scale-105 transition-all disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

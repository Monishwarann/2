import React, { useState } from 'react';
import { useMineStore } from '../stores/mineStore';
import { Send, Cpu, HelpCircle, Activity } from 'lucide-react';

export const AISafetyAssistant: React.FC = () => {
  const { chatHistory, askAssistant } = useMineStore();
  const [query, setQuery] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    askAssistant(query);
    setQuery('');
  };

  const handleQuickQuery = (q: string) => {
    askAssistant(q);
  };

  return (
    <div className="p-6 space-y-6 flex-1 flex flex-col overflow-hidden font-sans">
      
      {/* Header */}
      <div className="shrink-0">
        <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
          Explainable AI Safety Assistant
        </h2>
        <p className="text-xs text-mine-textMuted uppercase mt-1">
          Query live telemetry logs, hazard diffusion models, and worker risk scores in natural language
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 flex-1 min-h-0 items-stretch">
        
        {/* Chat box area */}
        <div className="col-span-3 glass-card rounded-xl p-5 flex flex-col justify-between overflow-hidden">
          
          {/* Scrollable logs */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 font-mono text-xs mb-4">
            {chatHistory.map((chat, idx) => {
              const isAssistant = chat.sender === 'assistant';
              const alignment = isAssistant ? 'justify-start' : 'justify-end';
              const msgBg = isAssistant 
                ? 'bg-[#132235] text-[#E8F4FD] border border-[rgba(0,212,255,0.1)]' 
                : 'bg-cyan-900/40 text-mine-cyan border border-[rgba(0,212,255,0.25)]';

              return (
                <div key={idx} className={`flex ${alignment}`}>
                  <div className={`max-w-[80%] rounded-lg p-3.5 space-y-1.5 ${msgBg}`}>
                    <div className="flex justify-between items-center text-[9px] text-mine-textMuted font-bold">
                      <span>{isAssistant ? 'MINEGUARDIAN SAFETY AI' : 'CONSOLE OPERATOR'}</span>
                      <span>{chat.timestamp}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line">{chat.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} className="flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask safety queries e.g., 'Who is at highest risk?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-[#132235] border border-[rgba(0,212,255,0.15)] rounded-lg py-2.5 px-4 text-xs text-[#E8F4FD] focus:outline-none focus:border-[#00D4FF] transition-all font-mono"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#00D4FF] text-black hover:bg-cyan-400 rounded-lg transition-all shadow-glowCyan"
            >
              <Send className="w-4 h-4 fill-black" />
            </button>
          </form>

        </div>

        {/* Suggestion list panel */}
        <div className="col-span-1 space-y-4">
          
          <div className="glass-card rounded-xl p-5 space-y-4 font-mono text-xs flex flex-col justify-between h-full">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Quick Queries
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => handleQuickQuery("Who is at highest risk?")}
                  className="w-full text-left p-2.5 bg-[#132235] hover:bg-[#1B263B] border border-[rgba(0,212,255,0.08)] rounded text-[10px] text-mine-textMuted hover:text-[#E8F4FD] transition-colors"
                >
                  "Which worker is in highest danger?"
                </button>
                <button
                  onClick={() => handleQuickQuery("Show today's gas trend.")}
                  className="w-full text-left p-2.5 bg-[#132235] hover:bg-[#1B263B] border border-[rgba(0,212,255,0.08)] rounded text-[10px] text-mine-textMuted hover:text-[#E8F4FD] transition-colors"
                >
                  "Show gas trends."
                </button>
                <button
                  onClick={() => handleQuickQuery("Which worker requires immediate evacuation?")}
                  className="w-full text-left p-2.5 bg-[#132235] hover:bg-[#1B263B] border border-[rgba(0,212,255,0.08)] rounded text-[10px] text-mine-textMuted hover:text-[#E8F4FD] transition-colors"
                >
                  "Where is the safe zone exit path?"
                </button>
                <button
                  onClick={() => handleQuickQuery("Which rescue robots are active?")}
                  className="w-full text-left p-2.5 bg-[#132235] hover:bg-[#1B263B] border border-[rgba(0,212,255,0.08)] rounded text-[10px] text-mine-textMuted hover:text-[#E8F4FD] transition-colors"
                >
                  "Are rescue robots online?"
                </button>
              </div>
            </div>

            <div className="p-3 bg-[rgba(5,11,24,0.4)] border border-[rgba(0,212,255,0.08)] rounded text-[10px] text-mine-textMuted flex gap-2 items-start mt-auto">
              <Cpu className="w-5 h-5 text-mine-cyan shrink-0 animate-pulse" />
              <div>
                Parsing semantic tokens dynamically against global state storage caches.
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

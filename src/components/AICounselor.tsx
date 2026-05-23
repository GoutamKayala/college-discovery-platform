import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { X, Send, Sparkles, AlertCircle, RefreshCw, UserCheck, HelpCircle, GraduationCap } from 'lucide-react';
import { ChatMessage } from '../types';

interface AICounselorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AICounselor({ isOpen, onClose }: AICounselorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      content: "Hello! I am your personal **EduPath AI Counselor**. I'm here to help you navigate your college search across India.\n\nAsk me anything! For example:\n- Which colleges have the best placements or highest packages?\n- Show me high-ranking colleges with low or cost-effective fees.\n- What are the JEE Advanced rank parameters for IIT Bombay?\n- Can you help me pick between BITS Pilani and Netaji Subhas in Delhi?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const samplePrompts = [
    "Highest placement packages?",
    "Best low-budget colleges?",
    "IIT Bombay CSE cutoffs?",
    "BITS Pilani vs. NIT Trichy?"
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, sending]);

  if (!isOpen) return null;

  async function handleSend(customText?: string) {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    setErrorHeader('');
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setSending(true);

    try {
      // Map structures to api messages format expectable by express route
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content
      }));

      const response = await api.askCounselor(apiMessages);
      
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setErrorHeader('Failed to transmit message. Please try querying again.');
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-ai-err`,
          sender: 'ai',
          content: "I apologize, my communication node is temporarily offline. I would love to tell you that Jadavpur University offers legendary CSE degrees under ₹10,000, and IIT Bombay dominates packages. Ask me again shortly!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setSending(false);
    }
  }

  // Simple and highly robust dynamic message format-renderer to handle markdown bold lists
  function formatMessageContent(content: string) {
    const lines = content.split('\n');
    return lines.map((line, lIdx) => {
      // Handle list items starting with - or *
      const isListItem = line.trim().startsWith('-') || line.trim().startsWith('*');
      let text = isListItem ? line.trim().substring(1).trim() : line;

      // Simple regex parser to replace **bold** with <strong>bold</strong>
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(<span key={`text-before-${match.index}`}>{text.substring(lastIndex, match.index)}</span>);
        }
        parts.push(<strong className="font-bold text-slate-900" key={`bold-${match.index}`}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < text.length) {
        parts.push(<span key="text-rest">{text.substring(lastIndex)}</span>);
      }

      if (isListItem) {
        return (
          <li key={lIdx} className="ml-4 list-disc pl-1 text-slate-700 mt-1 first:mt-0 text-xs leading-relaxed">
            {parts.length > 0 ? parts : text}
          </li>
        );
      }

      return (
        <p key={lIdx} className="text-xs text-slate-700 leading-relaxed min-h-[0.5rem] mt-1.5 first:mt-0 font-sans">
          {parts.length > 0 ? parts : text}
        </p>
      );
    });
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col h-full animate-slide-in">
      
      {/* Dynamic Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/95 brand-gradient text-white shadow-md shadow-blue-900/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight font-display">A.I Admission counselor</h3>
            <span className="block text-[9px] uppercase tracking-widest text-slate-300 font-medium font-sans">Personalized Career Guide</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
          title="Close chat pane"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages View Port */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                isAi ? 'self-start mr-auto' : 'self-end ml-auto items-end'
              }`}
            >
              <div
                className={`p-3 rounded-2xl subtle-shadow border text-slate-800 ${
                  isAi
                    ? 'bg-white border-slate-100 rounded-tl-none'
                    : 'bg-blue-600 text-white border-blue-600 rounded-tr-none'
                }`}
              >
                {isAi ? (
                  <div className="space-y-1">{formatMessageContent(msg.content)}</div>
                ) : (
                  <p className="text-xs leading-relaxed font-sans font-medium">{msg.content}</p>
                )}
              </div>
              <span className="text-[9px] text-slate-400 font-medium uppercase mt-1 px-1 mono-font">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {sending && (
          <div className="flex flex-col max-w-[85%] self-start mr-auto items-start">
            <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none subtle-shadow flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[8px] uppercase tracking-wider text-slate-400 mt-1 pl-1 font-semibold">EduPath Assistant is typing...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Inputs controller area */}
      <div className="p-4 border-t border-slate-100 bg-white space-y-3 shrink-0">
        
        {/* Sample Prompt Suggestions */}
        {messages.length === 1 && (
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 pl-1">Suggestion Prompts</span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 text-[10px] font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-all font-sans"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Input Block */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Type your admissions preferences..."
            className="flex-1 py-2.5 px-4 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || sending}
            className="p-2.5 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 rounded-xl transition-colors shadow-sm"
            title="Send query message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Paperclip, Heart, Shield, CheckCheck, Video, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatTime } from '../../utils/formatters';
import ClientNavbar from '../../components/common/ClientNavbar';

export const ClientChat = () => {
  const { currentClient } = useAuth();
  const { therapist, messages, sendMessage } = useData();

  const [text, setText] = useState('');
  const [isTherapistTyping, setIsTherapistTyping] = useState(false);
  const endRef = useRef(null);

  // Client messages
  const clientMessages = messages.filter(m => m.clientId === currentClient.id);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [clientMessages, isTherapistTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage(currentClient.id, 'client', text.trim());
    setText('');

    // Simulate Dr. Sharma typing response
    setTimeout(() => {
      setIsTherapistTyping(true);
      setTimeout(() => {
        setIsTherapistTyping(false);
      }, 2000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-vanilla text-midnight flex flex-col font-sans pb-10">
      <ClientNavbar />

      <main className="max-w-3xl mx-auto w-full p-4 sm:p-8 flex-1 flex flex-col">
        {/* Chat Card */}
        <div className="bg-white rounded-3xl border border-misty/30 card-shadow flex-1 flex flex-col overflow-hidden h-[600px]">
          {/* Header */}
          <div className="p-4 px-6 border-b border-misty/20 bg-vanilla/40 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={therapist.avatar}
                  alt={therapist.name}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-blush"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-sage border-2 border-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-midnight">{therapist.name}</h3>
                <span className="text-[11px] text-sage-dark font-medium flex items-center gap-1">
                  Active • Typically responds within clinical hours
                </span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-vanilla text-rosewood border border-blush/40" title="Telehealth Care Channel">
              <Heart size={16} />
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-vanilla-light/30 text-xs">
            <div className="text-center py-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-vanilla text-midnight-muted border border-misty/20">
                End-to-End Encrypted Asynchronous Therapy Log
              </span>
            </div>

            {clientMessages.map((msg) => {
              const isClient = msg.sender === 'client';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md p-4 rounded-2xl space-y-1.5 leading-relaxed shadow-sm ${
                    isClient
                      ? 'bg-rosewood text-white rounded-br-none'
                      : 'bg-white text-midnight border border-misty/30 rounded-bl-none'
                  }`}>
                    <p>{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 text-[10px] ${
                      isClient ? 'text-blush-light' : 'text-midnight-muted'
                    }`}>
                      <span>{formatTime(msg.timestamp?.split('T')[1]?.slice(0, 5) || '14:00')}</span>
                      {isClient && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTherapistTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-misty/30 rounded-2xl px-4 py-2 flex items-center gap-1.5 text-xs text-midnight-muted shadow-sm">
                  <span>{therapist.name} is typing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-4 border-t border-misty/20 bg-white flex items-center gap-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Share a reflection or question with ${therapist.name}...`}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-misty/40 bg-vanilla/30 text-xs text-midnight placeholder:text-midnight-muted focus:outline-none focus:border-rosewood"
            />

            <button
              type="submit"
              disabled={!text.trim()}
              className="px-5 py-2.5 rounded-2xl bg-rosewood text-white text-xs font-bold hover:bg-rosewood-hover disabled:opacity-40 transition shadow-md shadow-rosewood/20 flex items-center gap-1.5"
            >
              <Send size={14} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ClientChat;

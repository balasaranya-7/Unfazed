import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Smile,
  Video,
  Phone,
  CheckCheck,
  Circle,
  MoreVertical,
  Clock,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatTime } from '../../utils/formatters';

export const Chat = () => {
  const { clients, messages, sendMessage } = useData();

  // Selected client
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || 'cl-1');
  const [searchFilter, setSearchFilter] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Filter messages for current client
  const conversationMessages = messages.filter(m => m.clientId === selectedClientId);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(selectedClientId, 'therapist', inputText.trim());
    setInputText('');

    // Simulate client typing & response after 2.5s
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        sendMessage(selectedClientId, 'client', 'Thank you Dr. Sharma! I will practice this exercise and see you in our upcoming session.');
      }, 2000);
    }, 800);
  };

  // Filter client conversations
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-vanilla h-[calc(100vh-2rem)] sm:h-screen overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-misty/30 px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Client Messaging</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
              <span className="text-xs font-semibold text-midnight-muted">Secure Asynchronous Care</span>
            </div>
            <h1 className="text-xl font-bold font-display text-midnight tracking-tight">
              Direct Client Communications
            </h1>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Chat Layout */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6">
        {/* Left: Conversation List */}
        <div className="w-full sm:w-80 md:w-96 bg-white rounded-3xl border border-misty/30 card-shadow flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-misty/20">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-muted" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-misty/40 bg-vanilla/40 text-xs text-midnight placeholder:text-midnight-muted focus:outline-none focus:border-rosewood"
              />
            </div>
          </div>

          {/* Client List */}
          <div className="flex-1 overflow-y-auto divide-y divide-misty/15">
            {filteredClients.map((client) => {
              const clientMsgs = messages.filter(m => m.clientId === client.id);
              const lastMsg = clientMsgs[clientMsgs.length - 1];
              const isSelected = client.id === selectedClientId;

              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                    isSelected
                      ? 'bg-vanilla/70 border-l-4 border-rosewood'
                      : 'hover:bg-vanilla/30'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-blush/60"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-sage border-2 border-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-midnight truncate">{client.name}</h4>
                      <span className="text-[10px] text-midnight-muted">
                        {lastMsg ? formatTime(lastMsg.timestamp?.split('T')[1]?.slice(0, 5) || '18:30') : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-midnight-muted truncate">
                      {lastMsg ? lastMsg.text : 'Tap to open chat history'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Conversation Window */}
        <div className="hidden sm:flex flex-1 bg-white rounded-3xl border border-misty/30 card-shadow flex-col overflow-hidden">
          {/* Client Header */}
          <div className="p-4 px-6 border-b border-misty/20 bg-vanilla/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedClient.avatar}
                alt={selectedClient.name}
                className="w-10 h-10 rounded-2xl object-cover border border-blush"
              />
              <div>
                <h3 className="text-sm font-bold text-midnight">{selectedClient.name}</h3>
                <span className="text-[11px] text-sage-dark font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage" /> Active Now • Next Session: {selectedClient.nextSession ? 'Tomorrow' : 'Scheduled'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-xl text-midnight hover:bg-vanilla transition border border-misty/30"
                title="Initiate telehealth video call"
              >
                <Video size={16} className="text-rosewood" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-vanilla-light/30">
            {conversationMessages.map((msg) => {
              const isTherapist = msg.sender === 'therapist';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isTherapist ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md rounded-2xl p-4 space-y-1.5 text-xs leading-relaxed shadow-sm ${
                    isTherapist
                      ? 'bg-midnight text-vanilla rounded-br-none'
                      : 'bg-white text-midnight border border-misty/30 rounded-bl-none'
                  }`}>
                    <p>{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 text-[10px] ${
                      isTherapist ? 'text-misty' : 'text-midnight-muted'
                    }`}>
                      <span>{formatTime(msg.timestamp?.split('T')[1]?.slice(0, 5) || '12:00')}</span>
                      {isTherapist && <CheckCheck size={13} className="text-blush" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulated Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-misty/30 rounded-2xl px-4 py-2.5 flex items-center gap-1.5 text-xs text-midnight-muted shadow-sm">
                  <span>{selectedClient.name} is typing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rosewood animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-rosewood animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-rosewood animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSend} className="p-4 border-t border-misty/20 bg-white flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-midnight-muted hover:text-midnight rounded-xl transition hover:bg-vanilla"
              title="Attach clinical worksheet or PDF"
            >
              <Paperclip size={18} />
            </button>
            <button
              type="button"
              className="p-2 text-midnight-muted hover:text-midnight rounded-xl transition hover:bg-vanilla"
              title="Add emoji"
            >
              <Smile size={18} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${selectedClient.name}...`}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-misty/40 bg-vanilla/30 text-xs text-midnight placeholder:text-midnight-muted focus:outline-none focus:border-rosewood"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-2xl bg-rosewood text-white hover:bg-rosewood-hover disabled:opacity-40 transition shadow-md shadow-rosewood/20 flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

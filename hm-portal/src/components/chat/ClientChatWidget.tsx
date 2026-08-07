"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { getCompanyChat, sendMessage, markMessagesAsRead } from "@/app/actions/messages";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientChatWidgetProps {
  companyId: string;
}

export function ClientChatWidget({ companyId }: ClientChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    } else {
      // Background poll for unread messages could go here if needed,
      // but the main NotificationBell already handles global notifications.
      // For now we just load when opened.
    }
  }, [isOpen, companyId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    setIsLoading(true);
    const data = await getCompanyChat(companyId);
    setMessages(data);
    
    // Mark as read when opening
    await markMessagesAsRead(companyId);
    setUnreadCount(0); // Reset local unread count
    window.dispatchEvent(new Event("refresh-notifications"));
    setIsLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage.trim();
    setNewMessage(""); // Optimistic clear

    // Add optimistically
    const optMsg = {
      id: "temp-" + Date.now(),
      content,
      isFromClient: true,
      createdAt: new Date(),
      sender: { name: "Tú", role: "CLIENT" }
    };
    setMessages(prev => [...prev, optMsg]);

    const res = await sendMessage(companyId, content);
    if (!res.success) {
      // Revert if failed
      setMessages(prev => prev.filter(m => m.id !== optMsg.id));
      alert("Error al enviar mensaje");
    } else {
      loadMessages(); // Reload to get real ID and any missed messages
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex items-center justify-center"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col z-50" style={{ height: "450px" }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-indigo-50/50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">Mensajes con Administración</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {isLoading && messages.length === 0 ? (
              <div className="text-center text-slate-500 text-sm mt-4">Cargando mensajes...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-slate-500 text-sm mt-4">
                No hay mensajes aún. Escribe aquí para contactar a administración.
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.isFromClient;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="text-[10px] text-slate-400 mb-1 px-1">
                      {msg.sender.name} • {format(new Date(msg.createdAt), "HH:mm", { locale: es })}
                    </div>
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-br-sm"
                          : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white rounded-b-xl flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-slate-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

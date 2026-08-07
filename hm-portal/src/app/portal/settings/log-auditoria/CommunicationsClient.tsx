"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Building2, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getCompanyChat, sendMessage, markMessagesAsRead } from "@/app/actions/messages";

export default function CommunicationsClient({ communications }: { communications: any[] }) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-select first if available
  useEffect(() => {
    if (communications.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(communications[0].companyId);
    }
  }, [communications]);

  useEffect(() => {
    if (selectedCompanyId) {
      loadMessages(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async (companyId: string) => {
    setIsLoading(true);
    const data = await getCompanyChat(companyId);
    setMessages(data);
    await markMessagesAsRead(companyId);
    window.dispatchEvent(new Event("refresh-notifications"));
    setIsLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCompanyId) return;

    const content = newMessage.trim();
    setNewMessage(""); 

    // Optimistic
    const optMsg = {
      id: "temp-" + Date.now(),
      content,
      isFromClient: false,
      createdAt: new Date(),
      sender: { name: "Tú", role: "ADMIN" }
    };
    setMessages(prev => [...prev, optMsg]);

    const res = await sendMessage(selectedCompanyId, content);
    if (!res.success) {
      setMessages(prev => prev.filter(m => m.id !== optMsg.id));
      alert("Error al enviar mensaje");
    } else {
      loadMessages(selectedCompanyId);
    }
  };

  const selectedCompany = communications.find(c => c.companyId === selectedCompanyId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex h-[600px]">
      
      {/* Sidebar: Lista de empresas */}
      <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Bandeja de Entrada
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {communications.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              No hay comunicaciones registradas.
            </div>
          ) : (
            communications.map(comp => (
              <button
                key={comp.companyId}
                onClick={() => setSelectedCompanyId(comp.companyId)}
                className={`w-full text-left p-4 border-b border-slate-100 transition-colors flex flex-col gap-1 ${
                  selectedCompanyId === comp.companyId 
                    ? "bg-indigo-50 border-l-4 border-l-indigo-600" 
                    : "hover:bg-slate-100 border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-slate-800 truncate max-w-[80%]">
                    {comp.companyName}
                  </span>
                  {comp.unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {comp.unreadCount}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 truncate">{comp.lastMessage}</div>
                {comp.lastMessageDate && (
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(comp.lastMessageDate), "dd MMM HH:mm", { locale: es })}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col bg-white">
        {selectedCompany ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{selectedCompany.companyName}</h3>
                <p className="text-xs text-slate-500">Canal de comunicación directa</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {isLoading && messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                  <MessageSquare className="w-12 h-12 text-slate-300" />
                  <p>Inicia la conversación con esta empresa.</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = !msg.isFromClient;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-slate-600">{msg.sender.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {format(new Date(msg.createdAt), "HH:mm", { locale: es })}
                        </span>
                      </div>
                      <div
                        className={`max-w-[75%] px-4 py-2 text-sm shadow-sm ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm"
                            : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {isMe && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                          {msg.readByClient ? <CheckCircle2 className="w-3 h-3 text-indigo-400" /> : <CheckCircle2 className="w-3 h-3 text-slate-300" />}
                          {msg.readByClient ? "Leído" : "Enviado"}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="flex-1 bg-slate-100 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Enviar</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-3">
            <MessageSquare className="w-12 h-12" />
            <p>Selecciona una conversación del panel lateral</p>
          </div>
        )}
      </div>

    </div>
  );
}

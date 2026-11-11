'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Send, PhoneCall } from 'lucide-react';

interface Message {
    sender: 'ai' | 'user';
    text: string;
    showWhatsApp?: boolean;
}

export default function FloatingAIAgent() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'ai',
            text: 'Halo! 👋 Saya Cekreks CS Agent. Ada yang bisa saya bantu seputar layanan fotografi, photobooth, atau paket harga kami?',
            showWhatsApp: false,
        },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || isTyping) return;

        const userText = inputMessage;
        setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
        setInputMessage('');
        setIsTyping(true);

        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userText }),
        })
            .then(async (res) => {
                const data = await res.json();
                setIsTyping(false);
                if (res.ok) {
                    const rawReply = data.reply || '';
                    const hasWhatsAppTrigger = rawReply.includes('[SHOW_WHATSAPP]');
                    const cleanText = rawReply.replace('[SHOW_WHATSAPP]', '').trim();

                    setMessages((prev) => [
                        ...prev,
                        { sender: 'ai', text: cleanText, showWhatsApp: hasWhatsAppTrigger }
                    ]);
                } else {
                    setMessages((prev) => [
                        ...prev,
                        { sender: 'ai', text: 'Maaf, terjadi gangguan koneksi ke AI Agent. Silakan coba beberapa saat lagi.', showWhatsApp: true },
                    ]);
                }
            })
            .catch(() => {
                setIsTyping(false);
                setMessages((prev) => [
                    ...prev,
                    { sender: 'ai', text: 'Koneksi bermasalah. Anda bisa langsung menghubungi CS WhatsApp kami.', showWhatsApp: true },
                ]);
            });
    };

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-transparent"
                />
            )}

            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {!isOpen && isHovered && (
                    <div className="relative mb-3 flex items-center rounded-xl bg-[#121124] px-4 py-2.5 text-sm text-white shadow-xl border border-purple-500/30 animate-fade-in">
                        <span>Ada pertanyaan?</span>
                        <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-[#121124] border-r border-b border-purple-500/30"></div>
                    </div>
                )}

                {/* MODAL CHAT DENGAN ANIMASI POP-UP & RESPONSIF */}
                <div
                    className={`mb-4 flex h-[500px] w-[90vw] sm:w-[380px] max-w-[calc(100vw-3rem)] flex-col rounded-2xl bg-[#4A2D61] border border-purple-500/35 shadow-2xl overflow-hidden origin-bottom-right transition-all duration-300 ease-out ${isOpen
                            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 scale-95 translate-y-4 pointer-events-none absolute bottom-0 right-0'
                        }`}
                >
                    {/* Header Chat */}
                    <div className="flex items-center justify-between bg-[#3A224C] px-4 py-3.5 border-b border-purple-500/20">
                        <div className="flex items-center space-x-3">
                            {/* DIPERBAIKI: Overflow visible & z-index agar titik hijau tidak terpotong */}
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF512F] to-[#DD2476] text-white shadow-md overflow-visible">
                                <div className="relative h-full w-full rounded-xl overflow-hidden">
                                    <Image
                                        src="/images/cs/csagentai.jpeg"
                                        alt="CS Agent"
                                        fill
                                        sizes="40px"
                                        className="object-cover"
                                    />
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-[#3A224C] z-30"></span>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-bold text-white text-sm">CEKREKS CS Agent</h3>
                                    <span className="rounded bg-purple-900/80 px-1.5 py-0.5 text-[10px] font-semibold text-pink-300 border border-purple-500/30">
                                        ONLINE
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400">Asisten Layanan Fotografi</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Area Pesan */}
                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#a855f7 #131126',
                        }}
                    >
                        <style jsx>{`
                            div::-webkit-scrollbar {
                              width: 6px;
                            }
                            div::-webkit-scrollbar-track {
                              background: #131126;
                            }
                            div::-webkit-scrollbar-thumb {
                              background-color: #a855f7;
                              border-radius: 20px;
                            }
                        `}</style>

                        {messages.map((msg, index) => (
                            <div key={index} className="space-y-2">
                                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === 'user'
                                                ? 'bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white rounded-br-sm'
                                                : 'bg-[#211d42] text-gray-200 rounded-bl-sm border border-purple-500/20'
                                            }`}
                                    >
                                        <p className="leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>

                                {msg.sender === 'ai' && msg.showWhatsApp && (
                                    <div className="pt-1 pb-2">
                                        <a
                                            href="https://wa.me/6281234567890"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center space-x-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 text-white font-medium shadow-lg transition-all text-xs"
                                        >
                                            <PhoneCall size={15} />
                                            <span>Hubungi CS WhatsApp</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-[#211d42] text-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 border border-purple-500/20 shadow-sm flex items-center space-x-1.5">
                                    <span className="h-2 w-2 rounded-full bg-pink-400 animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 rounded-full bg-pink-400 animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 rounded-full bg-pink-400 animate-bounce"></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Chat Footer */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-[#3A224C] border-t border-purple-500/20 flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Tanya seputar paket/layanan..."
                            className="flex-1 rounded-xl bg-[#110f24] px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/10"
                        />
                        <button
                            type="submit"
                            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF512F] to-[#DD2476] p-2.5 text-white hover:opacity-90 shadow-md transition-opacity"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>

                {/* Tombol Utama Floating dengan logo baru csagentai.jpeg */}
                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="flex items-center space-x-3 rounded-full bg-gradient-to-r from-[#FF512F]/90 via-[#EC38BC]/90 to-[#7303C0]/90 px-5 py-3 text-white font-semibold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
                >
                    {isOpen ? (
                        <>
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
                                <X size={18} />
                            </div>
                            <span>Tutup CS Agent</span>
                        </>
                    ) : (
                        <>
                            <div className="relative h-8 w-8 -my-2 -ml-2 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/40 shadow-md">
                                <Image
                                    src="/images/cs/csagentai.jpeg"
                                    alt="CS Avatar"
                                    fill
                                    sizes="48px"
                                    className="object-cover object-top"
                                />
                            </div>
                            <span className="tracking-wide">Tanya CS Agent</span>
                        </>
                    )}
                </button>
            </div>
        </>
    );
}
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse, speakText } from '../../services/geminiService';
import { ChatMessage } from '../../types';

export const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Merhaba! Ben Vural Enerji yapay zeka asistanıyım. Size nasıl yardımcı olabilirim?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => setIsOpen(!isOpen);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Convert messages to history format for API
        // Filter out the first greeting message if it is from 'model' to avoid "First content should be with role 'user'" error
        const apiHistoryMessages = messages.filter((_, index) => !(index === 0 && messages[0].role === 'model'));

        const history = apiHistoryMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const responseText = await getChatResponse(userMsg.text, history);

        const modelMsg: ChatMessage = { role: 'model', text: responseText };
        setMessages(prev => [...prev, modelMsg]);
        setIsLoading(false);
    };

    const handleTTS = (text: string) => {
        speakText(text);
    };
    // Only allow playing one at a time roughly or handle state
    // This is a simple implementation


    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl w-80 sm:w-96 h-[500px] mb-4 flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-primary p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">smart_toy</span>
                            <h3 className="font-bold">Enerji Asistanı</h3>
                        </div>
                        <button onClick={toggleChat} className="hover:bg-white/20 rounded-full p-1 transition">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#152018]">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-primary text-black rounded-tr-none'
                                    : 'bg-white dark:bg-surface-dark text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-sm'
                                    }`}>
                                    <p>{msg.text}</p>
                                    {msg.role === 'model' && (
                                        <button
                                            onClick={() => handleTTS(msg.text)}
                                            className="mt-2 flex items-center gap-1 text-[10px] opacity-70 hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">volume_up</span>
                                            Dinle
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-surface-dark p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark flex gap-2">
                        <input
                            type="text"
                            className="flex-1 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-sm focus:ring-primary focus:border-primary dark:text-white"
                            placeholder="Bir soru sorun..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-primary text-black p-2 rounded-xl hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={toggleChat}
                className="bg-primary hover:bg-green-400 text-black p-4 rounded-full shadow-lg shadow-primary/30 transition-all hover:scale-110 flex items-center justify-center"
            >
                <span className="material-symbols-outlined text-3xl">chat_bubble</span>
            </button>
        </div>
    );
};


import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Zap, Cpu, Copy, Check, Trash2, ArrowUpCircle, Book, Languages, ImageIcon as ArtIcon, Sparkles } from 'lucide-react';
import { Message, AppLanguage } from '../types';
import { translations } from '../services/translations';
import { chatWithGemini } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markdown';

interface ChatViewProps {
  onUseCredit: () => boolean;
  isPro: boolean;
  language: AppLanguage;
}

const ChatView: React.FC<ChatViewProps> = ({ onUseCredit, isPro, language }) => {
  const t = translations[language].chat;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    Prism.highlightAll();
  }, [messages, isLoading]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input.trim();
    if ((!textToSend && !selectedImage) || isLoading) return;
    
    if (!onUseCredit()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await chatWithGemini(textToSend || "Describe this image.", userMsg.image, isPro);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'Error processing request.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const MarkdownComponents = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      const codeId = React.useMemo(() => Math.random().toString(36).substring(7), []);

      if (!inline && match) {
        return (
          <div className="relative group/code my-4 rounded-lg border border-white/10 overflow-hidden bg-black">
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#2f2f2f] text-white/50">
              <span className="text-[10px] font-bold uppercase">{match[1]}</span>
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(codeString);
                   setCopyingId(codeId);
                   setTimeout(() => setCopyingId(null), 2000);
                }}
                className="hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold"
              >
                {copyingId === codeId ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copyingId === codeId ? 'Copied' : 'Copy code'}
              </button>
            </div>
            <pre className={`p-4 overflow-x-auto text-sm ${className}`}>
              <code className={className} {...props}>{children}</code>
            </pre>
          </div>
        );
      }
      return <code className="bg-white/10 px-1 py-0.5 rounded text-sm" {...props}>{children}</code>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#212121] relative overflow-hidden">
      
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto pt-10 pb-40 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 max-w-2xl mx-auto animate-fade-up">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6">
              <Sparkles size={24} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-10 text-center">{t.greeting}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              {[
                { label: 'Look up Zomi word', sub: 'Open dictionary', icon: <Book className="text-blue-400" size={18} />, prompt: 'What does "Inntung" mean in the Zomi Tedim dialect?' },
                { label: 'Translate a sentence', sub: 'English to Zomi', icon: <Languages className="text-green-400" size={18} />, prompt: 'Translate "Welcome to our home" into Zomi Tedim.' },
                { label: 'Generate Zomi Art', sub: 'Using AI studio', icon: <ArtIcon className="text-purple-400" size={18} />, prompt: 'Generate an artistic image of Zomi traditional patterns.' },
                { label: 'Zomi History', sub: 'Tell me a story', icon: <Cpu className="text-orange-400" size={18} />, prompt: 'Tell me a brief summary of Zomi cultural history.' }
              ].map((card, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(card.prompt)}
                  className="p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-left group"
                >
                  <div className="mb-2">{card.icon}</div>
                  <div className="text-sm font-medium text-white">{card.label}</div>
                  <div className="text-xs text-white/40">{card.sub}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full px-4 space-y-10">
            {messages.map((msg) => (
              <div key={msg.id} className="group animate-fade-up">
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-white/10 ${
                    msg.role === 'assistant' ? 'bg-black text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {msg.role === 'assistant' ? <Sparkles size={16} /> : <span className="text-[10px] font-bold uppercase">Me</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-white mb-1">
                      {msg.role === 'assistant' ? 'ZomiGPT' : 'You'}
                    </div>
                    {msg.image && (
                      <img src={`data:image/png;base64,${msg.image}`} className="max-w-md rounded-lg mb-3 border border-white/10" />
                    )}
                    <div className="text-white/90 leading-relaxed text-[15px] markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-4 md:gap-6 items-start animate-pulse">
                <div className="w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-white/40" />
                </div>
                <div className="w-12 h-6 bg-white/5 rounded-full mt-2"></div>
               </div>
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-10 pb-6 px-4">
        <div className="max-w-3xl mx-auto w-full relative">
          
          {selectedImage && (
            <div className="absolute bottom-full mb-3 left-0">
               <div className="relative inline-block">
                <img src={`data:image/png;base64,${selectedImage}`} className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-black rounded-full p-1 border border-white/20 text-white hover:bg-white/10 transition-colors">
                  <X size={10} />
                </button>
               </div>
            </div>
          )}

          <div className="relative flex items-center">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-4 p-1 hover:bg-white/5 rounded-md transition-colors text-white/40 hover:text-white"
            >
              <ImageIcon size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    setSelectedImage(base64);
                  };
                  reader.readAsDataURL(file);
                }
              }} 
              className="hidden" 
              accept="image/*" 
            />
            
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isPro ? t.placeholderPro : t.placeholder}
              className="w-full bg-[#2f2f2f] text-white rounded-3xl py-4 pl-12 pr-14 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all resize-none shadow-xl text-[15px] leading-normal"
            />
            
            <button
              onClick={() => handleSend()}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className={`absolute right-3 p-1.5 rounded-full transition-all ${
                input.trim() || selectedImage ? 'bg-white text-black hover:bg-white/80' : 'bg-white/10 text-white/20 cursor-not-allowed'
              }`}
            >
              <ArrowUpCircle size={24} strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="text-center mt-3">
             <p className="text-[10px] text-white/30 font-medium">
              {t.inaccurate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;

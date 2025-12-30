
import React, { useState, useRef } from 'react';
import { Search, Book, Volume2, Loader2, Sparkles, Quote, Info, Link as LinkIcon, Cpu } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../services/translations';
import { dictionaryLookup, generateSpeech } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DictionaryView: React.FC<{ onUseCredit: () => boolean, language: AppLanguage }> = ({ onUseCredit, language }) => {
  const t = translations[language].dictionary;
  const [word, setWord] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleLookup = async () => {
    if (!word.trim() || isLoading) return;
    if (!onUseCredit()) return;
    
    setIsLoading(true);
    setResult(null);
    try {
      const data = await dictionaryLookup(word);
      setResult(data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListen = async () => {
    if (!result || isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      const cleanText = result.replace(/[#*`>|]/g, '').slice(0, 300);
      const base64Audio = await generateSpeech(cleanText);
      
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const ctx = audioContextRef.current;
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start(0);
      }
    } catch (error) {
      console.error("Listen error:", error);
      setIsSpeaking(false);
    }
  };

  const DictionaryComponents = {
    h1: ({ children }: any) => (
      <div className="mb-12 border-b-2 border-blue-600 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
          <Book className="text-blue-500" size={24} />
          {children}
        </h1>
      </div>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-black text-white mt-10 mb-6 flex items-center gap-3 bg-blue-600/5 py-2 px-4 rounded-lg border-l-4 border-blue-600">
        <Cpu size={18} className="text-blue-400" />
        {children}
      </h3>
    ),
    p: ({ children }: any) => <p className="text-gray-400 text-sm leading-relaxed mb-4">{children}</p>,
    strong: ({ children }: any) => <strong className="text-blue-400 font-bold">{children}</strong>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-600/30 pl-6 py-2 my-6 bg-[#1a1a1a] rounded-r-xl shadow-inner">
        <div className="text-gray-300 italic text-sm leading-relaxed">{children}</div>
      </blockquote>
    ),
    ul: ({ children }: any) => <ul className="list-none pl-2 mb-6 space-y-3">{children}</ul>,
    li: ({ children }: any) => (
      <li className="flex gap-4 group">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
        <div className="text-gray-400 text-sm">{children}</div>
      </li>
    ),
    table: ({ children }: any) => (
      <div className="my-8 overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
        <table className="w-full text-left text-sm border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-[#1a1a1a] text-blue-400 font-black uppercase tracking-wider text-[10px]">{children}</thead>,
    tbody: ({ children }: any) => <tbody className="divide-y divide-white/5">{children}</tbody>,
    th: ({ children }: any) => <th className="px-6 py-4">{children}</th>,
    td: ({ children }: any) => <td className="px-6 py-4 text-gray-300">{children}</td>,
    hr: () => <hr className="my-10 border-white/5" />,
    em: ({ children }: any) => <em className="text-gray-500 italic text-xs">{children}</em>
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 h-full flex flex-col">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Zomi Dictionary</h1>
        <p className="text-gray-500 font-medium tracking-wide">Advanced lexicon for Zomi and English.</p>
      </div>

      <div className="relative mb-12 group">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-[1.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700"></div>
        <div className="relative flex items-center">
          <div className="absolute left-6 text-blue-500">
            <Search size={22} />
          </div>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            placeholder="Type a word..."
            className="w-full bg-[#111] border border-white/5 text-white rounded-[1.5rem] py-5 pl-16 pr-40 focus:outline-none focus:border-blue-500/50 transition-all shadow-2xl text-lg font-medium placeholder:text-gray-700"
          />
          <button
            onClick={handleLookup}
            disabled={!word.trim() || isLoading}
            className="absolute right-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-900/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <Sparkles size={18} />
                Define
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-16 px-1">
        {!result && !isLoading && (
          <div className="h-64 flex flex-col items-center justify-center opacity-10 select-none grayscale">
            <Book size={100} className="mb-6" />
            <p className="font-black tracking-[0.3em] uppercase text-xs">Awaiting Entry</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-80 space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/40 blur-3xl rounded-full animate-pulse"></div>
              <div className="w-24 h-24 bg-[#111] border border-white/10 rounded-3xl flex items-center justify-center relative rotate-12 animate-in zoom-in duration-500">
                <Sparkles size={40} className="text-blue-500 animate-spin duration-[4s]" />
              </div>
            </div>
            <p className="text-white font-bold tracking-widest uppercase text-xs">Scanning Lexicon</p>
          </div>
        )}

        {result && (
          <div className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="absolute top-12 right-12 opacity-5 pointer-events-none select-none hidden md:block">
              <div className="w-48 h-64 bg-blue-500/20 rounded-2xl border-4 border-blue-500/40 rotate-12 flex items-center justify-center">
                <Book size={120} className="text-blue-500" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-end mb-12">
                <button 
                  onClick={handleListen}
                  disabled={isSpeaking}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-[#1a1a1a] px-5 py-2.5 rounded-full border transition-all group ${isSpeaking ? 'text-blue-400 border-blue-500/50 animate-pulse' : 'text-gray-500 border-white/5 hover:border-blue-500/30 hover:text-blue-400'}`}
                >
                  <Volume2 size={16} className={isSpeaking ? 'animate-bounce' : 'group-hover:scale-110'} />
                  {isSpeaking ? 'Speaking...' : 'Listen'}
                </button>
              </div>

              <div className="markdown-lexicon-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={DictionaryComponents}>
                  {result}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryView;

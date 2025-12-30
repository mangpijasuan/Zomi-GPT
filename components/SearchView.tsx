
import React, { useState } from 'react';
import { Search, Globe, Link as LinkIcon, ExternalLink, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { searchGrounding } from '../services/gemini';
import { AppLanguage } from '../types';

/**
 * Interface for SearchView props to resolve type errors in App.tsx.
 */
interface SearchViewProps {
  onUseCredit: () => boolean;
  language: AppLanguage;
}

const SearchView: React.FC<SearchViewProps> = ({ onUseCredit, language }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return;

    // Check credits before searching.
    if (!onUseCredit()) return;

    setIsLoading(true);
    setResult(null);
    try {
      const data = await searchGrounding(query);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Parser to match the "Real-time Grounded Search" UI in the reference image.
   */
  const renderSearchContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // 1. Section Header: ### **1. Category Name**
      if (line.startsWith('###')) {
        return (
          <h3 key={i} className="text-lg font-bold text-white mt-10 mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
            {line.replace(/###/g, '').trim().replace(/\*\*/g, '')}
          </h3>
        );
      }

      // 2. Bullet points with specific nested bolding support
      if (line.startsWith('* ')) {
        const bulletText = line.replace('* ', '');
        const segments = bulletText.split('**').filter(s => s.length > 0);
        
        return (
          <div key={i} className="mb-3 pl-4 flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
            <p className="text-gray-300 leading-relaxed text-sm">
              {segments.map((seg, idx) => {
                const isBold = bulletText.includes(`**${seg}**`);
                return (
                  <span key={idx} className={isBold ? 'text-white font-bold' : ''}>
                    {seg}
                  </span>
                );
              })}
            </p>
          </div>
        );
      }

      // Default fallback for plain text
      if (line.trim().length > 0) {
        return <p key={i} className="text-gray-400 leading-relaxed mb-4 text-sm">{line}</p>;
      }
      return null;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 h-full flex flex-col">
      <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Real-time Grounded Search</h1>
        <p className="text-gray-500 font-medium tracking-wide">Search the live web with AI analysis and direct citations.</p>
      </div>

      <div className="relative mb-12 group">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700"></div>
        <div className="relative flex items-center">
          <div className="absolute left-6 text-gray-500 group-focus-within:text-blue-500 transition-colors">
            <Search size={22} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Current stock market trends"
            className="w-full bg-[#111] border border-white/5 text-white rounded-full py-5 pl-16 pr-40 focus:outline-none focus:border-blue-500/50 transition-all shadow-2xl text-lg font-medium placeholder:text-gray-700"
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="absolute right-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-900/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-16 px-1">
        {!result && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {[
              { text: 'Current stock market trends', icon: <TrendingUp size={16} /> },
              { text: 'Latest global tech news', icon: <Globe size={16} /> },
              { text: 'Best AI tools of 2025', icon: <Sparkles size={16} /> },
              { text: 'Current price of Bitcoin', icon: <TrendingUp size={16} /> }
            ].map((s) => (
              <button
                key={s.text}
                onClick={() => { setQuery(s.text); }}
                className="bg-[#111] border border-white/5 p-5 rounded-2xl text-left text-gray-400 hover:text-white hover:bg-[#161616] hover:border-blue-500/30 transition-all flex items-center justify-between group shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="text-blue-500/50 group-hover:text-blue-500 transition-colors">
                    {s.icon}
                  </div>
                  <span className="font-medium">{s.text}</span>
                </div>
                <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-80 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
              <Globe size={64} className="text-blue-500 animate-spin duration-[5s] relative" />
            </div>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs animate-pulse">Accessing real-time web data</p>
          </div>
        )}

        {result && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              {/* Analysis Header Block */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <Globe className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Search Analysis</h3>
              </div>

              <div className="search-result-content">
                {renderSearchContent(result.text)}
              </div>
            </div>

            {result.sources.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
                  <LinkIcon size={14} /> Verification Sources
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#111] border border-white/5 p-4 rounded-2xl hover:bg-[#161616] hover:border-blue-500/30 transition-all flex items-start gap-4 group shadow-xl"
                    >
                      <div className="bg-[#1a1a1a] w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-all">
                        <Globe size={18} className="text-gray-600 group-hover:text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm truncate mb-0.5">{source.title}</p>
                        <p className="text-[10px] text-gray-600 truncate uppercase tracking-wider">{new URL(source.uri).hostname}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;

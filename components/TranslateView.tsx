
import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Loader2, Copy, Check } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../services/translations';
import { translateText } from '../services/gemini';

const TranslateView: React.FC<{ onUseCredit: () => boolean, language: AppLanguage }> = ({ onUseCredit, language }) => {
  const t = translations[language].translate;
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fromLang, setFromLang] = useState('English');
  const [toLang, setToLang] = useState('Zomi (Tedim)');
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim() || isLoading) return;
    if (!onUseCredit()) return;

    setIsLoading(true);
    try {
      const result = await translateText(inputText, fromLang, toLang);
      setOutputText(result || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(outputText);
    setOutputText('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-full flex flex-col">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
        <p className="text-gray-400">{t.sub}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-[#111] p-4 rounded-2xl border border-[#222]">
        <select 
          value={fromLang}
          onChange={(e) => setFromLang(e.target.value)}
          className="flex-1 bg-[#1a1a1a] text-white border border-[#333] rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500"
        >
          <option>English</option>
          <option>Zomi (Tedim)</option>
          <option>Burmese</option>
          <option>Chin (Falam)</option>
          <option>Chin (Hakha)</option>
        </select>
        
        <button 
          onClick={swapLanguages}
          className="p-3 bg-[#222] rounded-full hover:bg-purple-600 transition-colors text-white"
        >
          <ArrowRightLeft size={20} />
        </button>

        <select 
          value={toLang}
          onChange={(e) => setToLang(e.target.value)}
          className="flex-1 bg-[#1a1a1a] text-white border border-[#333] rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500"
        >
          <option>Zomi (Tedim)</option>
          <option>English</option>
          <option>Burmese</option>
          <option>Chin (Falam)</option>
          <option>Chin (Hakha)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 flex-1">
        <div className="flex flex-col">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 bg-[#111] border border-[#222] rounded-3xl p-6 text-white text-lg focus:outline-none focus:border-purple-500 transition-all resize-none shadow-xl"
          />
        </div>

        <div className="flex flex-col relative">
          <div className="flex-1 bg-[#111] border border-[#222] rounded-3xl p-6 text-white text-lg overflow-y-auto whitespace-pre-wrap shadow-xl">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                <Loader2 size={32} className="animate-spin text-purple-500" />
                <p className="text-sm">{t.translating}</p>
              </div>
            ) : outputText ? (
              outputText
            ) : (
              <p className="text-gray-600 italic">Translation results appear here</p>
            )}
          </div>
          {outputText && !isLoading && (
            <button 
              onClick={copyToClipboard}
              className="absolute bottom-4 right-4 bg-[#222] hover:bg-[#333] p-3 rounded-xl transition-all text-gray-400 hover:text-white"
            >
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </button>
          )}
        </div>
      </div>

      <button
        onClick={handleTranslate}
        disabled={!inputText.trim() || isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-2xl disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Languages size={24} />}
        {t.button}
      </button>
    </div>
  );
};

export default TranslateView;

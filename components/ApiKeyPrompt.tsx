import React, { useState } from 'react';
import { Key, ExternalLink, AlertCircle } from 'lucide-react';

interface ApiKeyPromptProps {
  onSubmit: (apiKey: string) => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }
    if (!apiKey.startsWith('AIza')) {
      setError('Invalid API key format. Should start with "AIza"');
      return;
    }
    onSubmit(apiKey.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Key className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">API Key Required</h2>
            <p className="text-gray-400 text-sm">Enter your Google Gemini API key</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              placeholder="AIzaSy..."
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-300 mb-3">
              Don't have an API key? Get one for free:
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              <ExternalLink size={16} />
              Get API Key from Google AI Studio
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            Continue
          </button>

          <p className="text-xs text-gray-500 text-center">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;

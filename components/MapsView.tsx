
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Map as MapIcon, Loader2, Link as LinkIcon } from 'lucide-react';
import { mapsGrounding } from '../services/gemini';
import { AppLanguage } from '../types';

/**
 * Interface for MapsView props to resolve type errors in App.tsx.
 */
interface MapsViewProps {
  onUseCredit: () => boolean;
  language: AppLanguage;
}

const MapsView: React.FC<MapsViewProps> = ({ onUseCredit, language }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn('Location access denied')
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return;

    // Check credits before searching.
    if (!onUseCredit()) return;

    setIsLoading(true);
    try {
      const data = await mapsGrounding(query, location || undefined);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-full flex flex-col">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Location Intelligence</h1>
        <p className="text-gray-400">Find places, get directions, and explore local business insights.</p>
      </div>

      <div className="relative mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Italian restaurants with outdoor seating near me..."
          className="w-full bg-[#111] border border-[#222] text-white rounded-2xl py-5 pl-14 pr-32 focus:outline-none focus:border-green-500 transition-all shadow-xl"
        />
        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500" size={24} />
        <button
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
            <>
              <Navigation size={18} />
              Explore
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!result && !isLoading && (
          <div className="text-center space-y-6 opacity-60">
            <MapIcon size={64} className="mx-auto text-[#333]" />
            <div className="flex flex-wrap justify-center gap-2">
              {['Best sushi nearby', 'EV chargers in Seattle', 'Hotels with mountain views', 'Open parks'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setQuery(p)}
                  className="bg-[#1a1a1a] border border-[#222] px-4 py-2 rounded-full text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
            {location && (
              <p className="text-xs text-green-500/50">Location detected: {location.lat.toFixed(2)}, {location.lng.toFixed(2)}</p>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse"></div>
              <MapPin size={40} className="text-green-500 relative animate-bounce" />
            </div>
            <p className="text-gray-400">Triangulating places and reviews...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-[#111] border border-[#222] rounded-3xl p-8">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{result.text}</p>
            </div>

            {result.sources.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Featured Places</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#111] border border-[#222] p-4 rounded-2xl hover:bg-green-500/10 hover:border-green-500/30 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-green-500">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <p className="text-white font-medium group-hover:text-green-400 transition-colors">{source.title}</p>
                            <span className="text-[10px] text-gray-500 uppercase tracking-tight">Open in Maps</span>
                          </div>
                        </div>
                        <LinkIcon size={16} className="text-gray-600 group-hover:text-green-500 transition-colors" />
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

export default MapsView;

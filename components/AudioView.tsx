
import React, { useState, useRef } from 'react';
import { Music, Play, Volume2, Mic, Settings2, Loader2, Square, RotateCcw, ChevronDown } from 'lucide-react';
import { generateSpeech } from '../services/gemini';
import { AppLanguage } from '../types';

interface AudioViewProps {
  onUseCredit: () => boolean;
  language: AppLanguage;
}

const VOICES = [
  { name: 'Kore', label: 'Kore (Male, Professional)' },
  { name: 'Puck', label: 'Puck (Male, Energetic)' },
  { name: 'Charon', label: 'Charon (Male, Deep)' },
  // Fix: Mapping the correct voice name 'Zephyr' for the corresponding label
  { name: 'Zephyr', label: 'Zephyr (Female, Warm)' },
  { name: 'Fenrir', label: 'Fenrir (Male, Authoritative)' }
];

const AudioView: React.FC<AudioViewProps> = ({ onUseCredit, language }) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [showVoiceSelect, setShowVoiceSelect] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000,
    numChannels: number = 1,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {}
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleSpeech = async () => {
    if (!text.trim() || isGenerating) return;
    if (!onUseCredit()) return;

    setIsGenerating(true);
    stopPlayback();

    try {
      const base64Audio = await generateSpeech(text, selectedVoice);
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }

        const ctx = audioContextRef.current;
        const audioData = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        source.onended = () => {
          setIsPlaying(false);
          sourceNodeRef.current = null;
        };

        sourceNodeRef.current = source;
        source.start(0);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Speech generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-full flex flex-col items-center overflow-y-auto custom-scrollbar">
      <div className="w-full text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-4">
          <Volume2 className="text-indigo-400" size={14} />
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Premium TTS Engine</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Natural Voice Synthesis</h1>
        <p className="text-gray-400">Convert any text into high-fidelity speech.</p>
      </div>

      <div className="w-full bg-[#111] border border-[#222] rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Mic size={120} className="text-indigo-500" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
              <Mic className="text-white" size={24} />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowVoiceSelect(!showVoiceSelect)}
                className="flex items-center gap-2 text-white font-bold text-lg hover:text-indigo-400 transition-colors"
              >
                Voice: {selectedVoice}
                <ChevronDown size={16} />
              </button>
              {showVoiceSelect && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {VOICES.map(v => (
                    <button
                      key={v.name}
                      onClick={() => { setSelectedVoice(v.name); setShowVoiceSelect(false); }}
                      className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-indigo-600/10 ${selectedVoice === v.name ? 'text-indigo-400' : 'text-gray-400'}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Engine Active</p>
              </div>
            </div>
          </div>
          <button className="p-3 bg-[#1a1a1a] border border-[#333] text-gray-400 hover:text-white rounded-xl transition-all">
            <Settings2 size={20} />
          </button>
        </div>

        <div className="relative z-10">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here to hear it spoken beautifully..."
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-3xl p-8 text-white h-56 focus:outline-none focus:border-indigo-500 transition-all resize-none text-xl leading-relaxed placeholder:text-gray-700 custom-scrollbar"
          />
        </div>

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="flex gap-3 w-full">
            <button
              onClick={handleSpeech}
              disabled={!text.trim() || isGenerating}
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 ${
                isGenerating 
                ? 'bg-[#222] text-gray-500' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-900/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Synthesizing...
                </>
              ) : isPlaying ? (
                <>
                  <RotateCcw size={24} />
                  Re-Synthesize
                </>
              ) : (
                <>
                  <Play size={24} fill="currentColor" />
                  Generate Speech
                </>
              )}
            </button>

            {isPlaying && (
              <button 
                onClick={stopPlayback}
                className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95"
              >
                <Square size={24} fill="currentColor" />
              </button>
            )}
          </div>
          
          {isPlaying && (
            <div className="w-full bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
              <div className="flex items-center gap-3 text-indigo-400">
                <div className="flex gap-1">
                  <div className="w-1 bg-indigo-400 h-4 animate-[bounce_1s_infinite]"></div>
                  <div className="w-1 bg-indigo-400 h-6 animate-[bounce_1.2s_infinite]"></div>
                  <div className="w-1 bg-indigo-400 h-3 animate-[bounce_0.8s_infinite]"></div>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest">Audio Playing</span>
              </div>
              <p className="text-[10px] text-indigo-500/60 uppercase font-black tracking-[0.2em]">24kHz PCM Stream</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="bg-[#111] border border-[#222] p-8 rounded-3xl text-center group hover:border-indigo-500/30 transition-all shadow-xl">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Volume2 className="text-blue-400" size={24} />
          </div>
          <h4 className="text-white font-bold mb-1 uppercase tracking-tight">HD Audio</h4>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">Crystal clear 24kHz sample rate.</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-8 rounded-3xl text-center group hover:border-indigo-500/30 transition-all shadow-xl">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Music className="text-indigo-400" size={24} />
          </div>
          <h4 className="text-white font-bold mb-1 uppercase tracking-tight">Rapid Response</h4>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">Powered by Gemini 2.5 Flash.</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-8 rounded-3xl text-center group hover:border-indigo-500/30 transition-all shadow-xl">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Mic className="text-orange-400" size={24} />
          </div>
          <h4 className="text-white font-bold mb-1 uppercase tracking-tight">Multi-Voice</h4>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">Natural personas for any context.</p>
        </div>
      </div>
    </div>
  );
};

export default AudioView;

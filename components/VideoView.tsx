
import React, { useState } from 'react';
import { Film, Play, Download, Loader2 } from 'lucide-react';
import { generateVideo } from '../services/gemini';
import { GeneratedVideo, AppLanguage } from '../types';

/**
 * Interface for VideoView props to resolve type errors in App.tsx.
 */
interface VideoViewProps {
  onUseCredit: () => boolean;
  language: AppLanguage;
}

const VideoView: React.FC<VideoViewProps> = ({ onUseCredit, language }) => {
  const [prompt, setPrompt] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    // Check credits before generating content.
    if (!onUseCredit()) return;

    setIsGenerating(true);
    setStatusMsg('Initializing session...');
    
    try {
      const url = await generateVideo(prompt, (status) => setStatusMsg(status));
      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        url,
        prompt,
        status: 'completed',
        timestamp: Date.now()
      };
      setVideos(prev => [newVideo, ...prev]);
    } catch (error) {
      console.error(error);
      setStatusMsg('Failed to generate video. Ensure your API key is correct.');
    } finally {
      setIsGenerating(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-full flex flex-col">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Cinematic AI Motion</h1>
        <p className="text-gray-400">Transform your words into stunning 720p videos.</p>
      </div>

      <div className="bg-[#111] border border-[#222] p-6 rounded-3xl mb-12 shadow-2xl">
        <div className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic drone shot of a lush tropical island at sunset, 4k, hyper-realistic..."
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-2xl p-5 text-white h-24 focus:outline-none focus:border-blue-500 transition-all resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Film size={14} />
              <span>Model: Veo 3.1 Fast</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play size={20} fill="currentColor" />
                  Generate Video
                </>
              )}
            </button>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
            <Loader2 size={18} className="text-blue-400 animate-spin" />
            <p className="text-blue-400 text-sm">{statusMsg || 'Generating video, please wait (this can take a minute)...'}</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Film className="text-blue-500" size={20} />
          Your Generations
        </h2>
        
        {videos.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center border border-dashed border-[#222] rounded-3xl text-gray-600">
            <Play size={40} className="mb-2 opacity-20" />
            <p>Ready to create your first scene?</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((vid) => (
              <div key={vid.id} className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden shadow-xl">
                <div className="aspect-video bg-black relative flex items-center justify-center">
                  <video src={vid.url} controls className="w-full h-full object-contain" />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-400 mb-4 italic">"{vid.prompt}"</p>
                  <a 
                    href={vid.url}
                    download={`zomiai-video-${vid.id}.mp4`}
                    className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                  >
                    <Download size={18} /> Download High Quality
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoView;

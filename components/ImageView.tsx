
import React, { useState } from 'react';
import { Sparkles, Download, RefreshCw, Layers } from 'lucide-react';
import { generateImage } from '../services/gemini';
import { GeneratedImage, AppLanguage } from '../types';

/**
 * Interface for ImageView props to resolve type errors in App.tsx.
 */
interface ImageViewProps {
  onUseCredit: () => boolean;
  isPro: boolean;
  language: AppLanguage;
}

const ImageView: React.FC<ImageViewProps> = ({ onUseCredit, isPro, language }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    // Check credits before generating content.
    if (!onUseCredit()) return;

    setIsGenerating(true);
    try {
      // Pass isPro to use higher quality model if available.
      const url = await generateImage(prompt, isPro);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt,
        timestamp: Date.now()
      };
      setImages(prev => [newImage, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-full flex flex-col">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Create Masterpieces</h1>
        <p className="text-gray-400">Describe your vision and let ZomiAI bring it to life.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-1 relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city with flying cars and neon lights, high resolution, digital art style..."
            className="w-full bg-[#111] border border-[#222] rounded-2xl p-5 text-white h-32 focus:outline-none focus:border-purple-500 transition-all resize-none shadow-inner"
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Painting...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate
              </>
            )}
          </button>
        </div>

        <div className="w-full md:w-64 space-y-4">
          <div className="bg-[#111] border border-[#222] p-4 rounded-2xl h-full flex flex-col justify-center items-center text-center">
            <Layers className="text-purple-400 mb-2" size={32} />
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Model</span>
            <span className="text-white font-medium mt-1">
              {isPro ? 'Gemini 3 Pro Image' : 'Gemini 2.5 Flash Image'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {images.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[#222] rounded-3xl opacity-50">
            <p className="text-gray-500">No images generated yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-purple-500 transition-all shadow-lg hover:shadow-purple-500/10">
                <img src={img.url} alt={img.prompt} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-xs text-white line-clamp-2 mb-3">{img.prompt}</p>
                  <div className="flex gap-2">
                    <a 
                      href={img.url} 
                      download={`zomiai-${img.id}.png`}
                      className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                    >
                      <Download size={16} /> Save
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageView;

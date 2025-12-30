
import React from 'react';
import { Check, Crown, Zap, Shield, Sparkles, Star } from 'lucide-react';
import { AppLanguage } from '../types';

/**
 * Interface for UpgradeView props including missing language prop.
 */
interface UpgradeViewProps {
  isPro: boolean;
  onUpgrade: () => void;
  language: AppLanguage;
}

const UpgradeView: React.FC<UpgradeViewProps> = ({ isPro, onUpgrade, language }) => {
  const tiers = [
    {
      name: 'Starter',
      price: 'Amawkna',
      description: 'ZomiAI a nam-tem hih-theihna.',
      features: [
        'Ni khat 5 vei zatzatna',
        'Siamna kician',
        'Gemini Flash model zatzatna',
        'Sih-leh-tan makaihna',
        'Dictionary leh Thuthak zon\'na'
      ],
      cta: 'Tu ni zat-lai',
      isPro: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/kha',
      description: 'Hun ciangtan omlau in kician takin zatzatna.',
      features: [
        'Hun ciangtan omlau zatzatna',
        'Manlang takin bawlna (3x faster)',
        'Gemini Pro model thupi',
        '4K Gam-lim bawlna',
        'High-Res Video Synthesis',
        'Nam tuamtuam Aw-bawlna',
        'Premium Support'
      ],
      cta: isPro ? 'Subscribed' : 'Pro ah hih-thak in',
      isPro: true,
      highlight: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 h-full overflow-y-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 mb-6">
          <Star className="text-yellow-500" size={16} fill="currentColor" />
          <span className="text-sm font-bold text-purple-400 uppercase tracking-widest">Pricing Plans</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Na Siamna <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Khauhsak in</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          ZomiAI Pro tawh na sepna te kician takin zom in. 
          Zomi creator leh pilna zong khempeuh adingin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className={`relative p-8 rounded-3xl border transition-all duration-500 h-full flex flex-col ${
              tier.highlight 
              ? 'bg-[#111] border-purple-500/50 shadow-[0_0_40px_-15px_rgba(168,85,247,0.3)] scale-105 z-10' 
              : 'bg-[#0e0e0e] border-[#222] opacity-80'
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                <Crown size={12} />
                Thupi Pen
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-white text-2xl font-bold mb-2">{tier.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tier.description}</p>
            </div>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-white text-5xl font-black">{tier.price}</span>
              {tier.period && <span className="text-gray-500 font-medium">{tier.period}</span>}
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className={`rounded-full p-1 flex-shrink-0 ${tier.highlight ? 'bg-purple-500/20 text-purple-400' : 'bg-[#222] text-gray-500'}`}>
                    <Check size={14} />
                  </div>
                  <span className={`text-sm ${tier.highlight ? 'text-gray-200' : 'text-gray-500'}`}>{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => tier.isPro && !isPro && onUpgrade()}
              disabled={isPro && tier.isPro || !tier.isPro}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                tier.highlight 
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-900/20' 
                : 'bg-[#222] text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPro && tier.isPro ? (
                <>
                  <Shield size={18} />
                  Manage Subscription
                </>
              ) : (
                <>
                  {tier.highlight && <Zap size={18} />}
                  {tier.cta}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all text-center">
        <div className="flex flex-col items-center gap-3">
          <Zap size={24} className="text-purple-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manlang takin</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Shield size={24} className="text-blue-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bitna Kician</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Sparkles size={24} className="text-green-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thuthak Thupi</span>
        </div>
      </div>
    </div>
  );
};

export default UpgradeView;

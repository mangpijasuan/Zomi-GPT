
import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import ImageView from './components/ImageView';
import VideoView from './components/VideoView';
import AudioView from './components/AudioView';
import SearchView from './components/SearchView';
import MapsView from './components/MapsView';
import DictionaryView from './components/DictionaryView';
import TranslateView from './components/TranslateView';
import UpgradeView from './components/UpgradeView';
import AuthView from './components/AuthView';
import ProfileView from './components/ProfileView';
import ErrorBoundary from './components/ErrorBoundary';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import { ViewType, FREE_DAILY_LIMIT, UserProfile, AppLanguage } from './types';
import { translations } from './services/translations';
import { getApiKey, setApiKey } from './services/gemini';
import { 
  Crown, 
  X, 
  Loader2, 
  Menu,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.CHAT); // Default to Chat
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('zomigpt_user');
    const today = new Date().toDateString();
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.lastResetDate !== today) {
        return { ...parsed, dailyCreditsUsed: 0, lastResetDate: today };
      }
      return parsed;
    }
    return { 
      isAuthenticated: false, isPro: false, dailyCreditsUsed: 0, 
      lastResetDate: today, language: 'en' 
    };
  });

  useEffect(() => {
    localStorage.setItem('zomigpt_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    // Check if API key is available
    if (!getApiKey()) {
      setShowApiKeyPrompt(true);
    }
  }, []);

  const handleApiKeySubmit = (apiKey: string) => {
    setApiKey(apiKey);
    setShowApiKeyPrompt(false);
  };

  const handleAuth = (email: string, username: string) => {
    setUser(prev => ({ ...prev, isAuthenticated: true, email, username }));
    setCurrentView(ViewType.CHAT);
  };

  const handleSignOut = () => {
    setUser(prev => ({ ...prev, isAuthenticated: false, username: undefined, email: undefined }));
    setCurrentView(ViewType.CHAT);
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const useCredit = () => {
    if (user.isPro) return true;
    if (user.dailyCreditsUsed < FREE_DAILY_LIMIT) {
      setUser(prev => ({ ...prev, dailyCreditsUsed: prev.dailyCreditsUsed + 1 }));
      return true;
    }
    return false;
  };

  const setLanguage = (lang: AppLanguage) => {
    setUser(prev => ({ ...prev, language: lang }));
  };

  const renderView = () => {
    const limitReached = !user.isPro && user.dailyCreditsUsed >= FREE_DAILY_LIMIT;
    const t_pw = translations[user.language].paywall;

    if (limitReached && ![ViewType.HOME, ViewType.SUBSCRIPTION, ViewType.AUTH, ViewType.PROFILE].includes(currentView)) {
      return (
        <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto px-4 text-center animate-fade-up">
          <Crown size={48} className="text-yellow-500 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">{t_pw.title}</h2>
          <p className="text-white/60 mb-8">{t_pw.sub}</p>
          <div className="flex flex-col w-full gap-3">
            <button onClick={() => setCurrentView(ViewType.SUBSCRIPTION)} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/80 transition-all">{t_pw.cta}</button>
            <button onClick={() => setCurrentView(ViewType.CHAT)} className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all">Dismiss</button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case ViewType.CHAT: return <ChatView onUseCredit={useCredit} isPro={user.isPro} language={user.language} />;
      case ViewType.IMAGE: return <ImageView onUseCredit={useCredit} isPro={user.isPro} language={user.language} />;
      case ViewType.VIDEO: return <VideoView onUseCredit={useCredit} language={user.language} />;
      case ViewType.AUDIO: return <AudioView onUseCredit={useCredit} language={user.language} />;
      case ViewType.SEARCH: return <SearchView onUseCredit={useCredit} language={user.language} />;
      case ViewType.MAPS: return <MapsView onUseCredit={useCredit} language={user.language} />;
      case ViewType.DICTIONARY: return <DictionaryView onUseCredit={useCredit} language={user.language} />;
      case ViewType.TRANSLATE: return <TranslateView onUseCredit={useCredit} language={user.language} />;
      case ViewType.SUBSCRIPTION: return <UpgradeView isPro={user.isPro} onUpgrade={() => setUser(p => ({...p, isPro: true}))} language={user.language} />;
      case ViewType.AUTH: return <AuthView language={user.language} onAuth={handleAuth} />;
      case ViewType.PROFILE: return <ProfileView user={user} language={user.language} onUpdate={handleUpdateProfile} />;
      default: return <ChatView onUseCredit={useCredit} isPro={user.isPro} language={user.language} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#212121] text-white overflow-hidden">
      {showApiKeyPrompt && <ApiKeyPrompt onSubmit={handleApiKeySubmit} />}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isPro={user.isPro}
        creditsUsed={user.dailyCreditsUsed}
        language={user.language}
        onLanguageChange={setLanguage}
        user={user}
        onSignOut={handleSignOut}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className="flex-1 h-full overflow-hidden flex flex-col relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#212121] border-b border-white/10 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 text-white/70 hover:text-white">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span className="font-semibold text-sm">ZomiGPT</span>
          </div>
          <div className="w-8"></div>
        </header>

        <ErrorBoundary>
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-white/50" size={32} /></div>}>
            {renderView()}
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;

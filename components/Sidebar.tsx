
import React from 'react';
import { ViewType, FREE_DAILY_LIMIT, AppLanguage, UserProfile } from '../types';
import { translations } from '../services/translations';
import { 
  Plus,
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Music, 
  MapPin, 
  Search,
  Book,
  Languages,
  Crown,
  Globe,
  LogOut,
  Settings,
  ChevronUp,
  X,
  Menu
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isPro: boolean;
  creditsUsed: number;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  user: UserProfile;
  onSignOut: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  isPro, 
  creditsUsed, 
  language, 
  onLanguageChange,
  user,
  onSignOut,
  isOpen,
  onToggle
}) => {
  const t = translations[language].sidebar;

  const menuItems = [
    { type: ViewType.CHAT, icon: <MessageSquare size={18} />, label: t.chat },
    { type: ViewType.DICTIONARY, icon: <Book size={18} />, label: t.dictionary },
    { type: ViewType.TRANSLATE, icon: <Languages size={18} />, label: t.translate },
    { type: ViewType.IMAGE, icon: <ImageIcon size={18} />, label: t.image },
    { type: ViewType.VIDEO, icon: <Video size={18} />, label: t.video },
    { type: ViewType.AUDIO, icon: <Music size={18} />, label: t.audio },
    { type: ViewType.SEARCH, icon: <Search size={18} />, label: t.search },
    { type: ViewType.MAPS, icon: <MapPin size={18} />, label: t.maps },
  ];

  const handleNav = (view: ViewType) => {
    onViewChange(view);
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as AppLanguage;
    onLanguageChange(value);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] md:hidden" 
          onClick={onToggle}
        />
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-[50] 
        w-64 bg-[#171717] border-r border-white/10
        flex flex-col py-3 px-3 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* New Chat Button */}
        <button 
          onClick={() => handleNav(ViewType.CHAT)}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 transition-colors mb-6 group"
        >
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Plus size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-white">New Chat</span>
        </button>

        {/* History / Tools List */}
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-2 mt-4">Capabilities</p>
          {menuItems.map((item) => (
            <button
              key={item.type}
              onClick={() => handleNav(item.type)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                currentView === item.type 
                ? 'bg-white/10 text-white' 
                : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-4 space-y-2 border-t border-white/10">
          {!isPro && (
            <button 
              onClick={() => handleNav(ViewType.SUBSCRIPTION)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-white transition-colors"
            >
              <Crown size={18} className="text-yellow-500" />
              <span>Upgrade to Plus</span>
            </button>
          )}

          <div className="px-3 py-2 flex items-center gap-3">
             <Globe size={16} className="text-white/40" />
             <select 
               value={language}
               onChange={handleLanguageChange}
               className="bg-transparent text-xs text-white/60 focus:outline-none appearance-none cursor-pointer hover:text-white transition-colors"
             >
               <option value="en">English</option>
               <option value="zo">Zomi</option>
               <option value="my">Burmese</option>
             </select>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                {user.username ? user.username.charAt(0) : 'U'}
              </div>
              <span className="text-sm font-medium text-white flex-1 text-left truncate">
                {user.username || 'User'}
              </span>
              <ChevronUp size={16} className="text-white/40" />
            </button>
            
            {/* Minimal Popover Mockup */}
            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#212121] border border-white/10 rounded-xl overflow-hidden shadow-2xl opacity-0 translate-y-2 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all pointer-events-none group-focus-within:pointer-events-auto">
              <button onClick={() => handleNav(ViewType.PROFILE)} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center gap-3">
                <Settings size={16} /> {t.profile}
              </button>
              <button onClick={onSignOut} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-3 border-t border-white/10">
                <LogOut size={16} /> {t.signOut}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

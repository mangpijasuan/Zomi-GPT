
import React, { useState } from 'react';
import { User, Mail, Globe, Save, Loader2, CheckCircle, Cpu } from 'lucide-react';
import { UserProfile, AppLanguage } from '../types';
import { translations } from '../services/translations';

interface ProfileViewProps {
  user: UserProfile;
  language: AppLanguage;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, language, onUpdate }) => {
  const t = translations[language].profile;
  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [prefLang, setPrefLang] = useState<AppLanguage>(user.language);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      onUpdate({
        username,
        email,
        language: prefLang
      });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 h-full flex flex-col items-center overflow-y-auto custom-scrollbar">
      <div className="w-full text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 rounded-full border border-blue-500/20 mb-4">
          <User className="text-blue-400" size={14} />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t.personalInfo}</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">{t.title}</h1>
        <p className="text-gray-400">{t.sub}</p>
      </div>

      <div className="w-full bg-[#111] border border-[#222] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
        {/* Glow Background */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Cpu size={120} className="text-blue-500" />
        </div>

        <div className="flex flex-col items-center mb-12">
          <div className="relative group/avatar">
            <div className="absolute -inset-4 bg-blue-600/20 rounded-full blur-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-2xl relative border-4 border-[#0a0a0a]">
              {username.charAt(0).toUpperCase() || <User size={40} />}
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mt-4">{username}</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-black mt-1">
            {user.isPro ? 'Pro Member' : 'Free Member'}
          </p>
        </div>

        {showSuccess && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-400 animate-in zoom-in duration-300">
            <CheckCircle size={20} />
            <p className="text-sm font-bold">{t.success}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.username}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.email}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.language}</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                <Globe size={18} />
              </div>
              <select
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value as AppLanguage)}
                className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="zo">Zomi (Tedim)</option>
                <option value="my">Burmese</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {t.saving}
                </>
              ) : (
                <>
                  <Save size={20} />
                  {t.save}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12 text-center opacity-30 select-none grayscale">
        <Cpu size={40} className="mx-auto mb-2" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zomi Intelligence Grid v1.0</p>
      </div>
    </div>
  );
};

export default ProfileView;

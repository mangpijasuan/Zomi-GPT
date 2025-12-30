
import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, ArrowRight, Github, Sparkles } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../services/translations';

interface AuthViewProps {
  language: AppLanguage;
  onAuth: (email: string, username: string) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ language, onAuth }) => {
  const t = translations[language].auth;
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !username)) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuth(email, username || email.split('@')[0]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[#212121]">
      <div className="w-full max-w-[400px] animate-fade-up">
        <div className="text-center mb-8">
           <Sparkles size={40} className="mx-auto mb-6 text-white" />
           <h1 className="text-3xl font-bold text-white mb-2">{isLogin ? t.signInTitle : t.signUpTitle}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.username}
              className="w-full bg-[#3c3c3c] border border-transparent focus:border-white/20 text-white rounded-lg py-3.5 px-4 focus:outline-none transition-all"
            />
          )}

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.email}
            className="w-full bg-[#3c3c3c] border border-transparent focus:border-white/20 text-white rounded-lg py-3.5 px-4 focus:outline-none transition-all"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.password}
            className="w-full bg-[#3c3c3c] border border-transparent focus:border-white/20 text-white rounded-lg py-3.5 px-4 focus:outline-none transition-all"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : t.signInBtn}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-white/60">
            {isLogin ? t.noAccount : t.hasAccount}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-bold hover:underline"
            >
              {isLogin ? t.switchSignUp : t.switchSignIn}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;

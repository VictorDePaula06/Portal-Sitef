'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Fingerprint, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-outfit">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="glass-card w-full max-w-[420px] rounded-3xl p-10 relative z-10 overflow-hidden group">
        
        {/* Animated top border gradient */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="flex flex-col items-center mb-10 mt-2">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full"></div>
            <div className="bg-gradient-to-br from-cyan-400 to-purple-600 p-4 rounded-2xl relative z-10 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Fingerprint className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mt-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white">
            Portal SiTef
          </h1>
          <p className="text-sm font-medium text-cyan-200/50 mt-2 uppercase tracking-widest">
            Acesso Restrito
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium backdrop-blur-md animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within/input:text-cyan-400 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail @globaltera.com.br"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:bg-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within/input:text-cyan-400 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha Global"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:bg-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="group/btn relative w-full overflow-hidden rounded-2xl p-[1px] transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 mt-4"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm"></span>
            <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-4 rounded-2xl font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]">
              {loading ? 'Autenticando...' : (
                <>
                  Acessar Sistema
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}

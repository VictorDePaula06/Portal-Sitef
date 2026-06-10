'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Store as StoreIcon, Lock } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/20 mb-4">
            <StoreIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Painel SiTef</h1>
          <p className="text-slate-400 mt-2 text-center">Acesso restrito para equipe <br/><span className="text-indigo-400 font-medium">@globaltera.com.br</span></p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">E-mail Corporativo</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome.sobrenome@globaltera.com.br"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Senha Única da Empresa</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Autenticando...' : 'Acessar Painel'}
          </button>
        </form>
      </div>
    </div>
  );
}

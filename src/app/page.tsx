'use client';

import { useState, useEffect } from 'react';
import { Store as StoreIcon, Search, AlertCircle, Plus, X, Pencil, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

type Account = {
  id: number;
  email: string;
  password?: string;
};

type Store = {
  id: number;
  name: string;
  cnpj: string;
  account: Account;
};

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    id: 0,
    accountId: 0,
    name: '',
    cnpj: '',
    email: '',
    password: ''
  });

  const fetchStores = async (q: string = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stores?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setStores(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStores(query);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({ id: 0, accountId: 0, name: '', cnpj: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (store: Store) => {
    setIsEditMode(true);
    setFormData({
      id: store.id,
      accountId: store.account.id,
      name: store.name,
      cnpj: store.cnpj,
      email: store.account.email,
      password: store.account.password || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const res = await fetch('/api/stores', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchStores(query);
        } else {
          alert('Erro ao atualizar cliente.');
        }
      } else {
        const res = await fetch('/api/stores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchStores(query);
        } else {
          alert('Erro ao cadastrar cliente.');
        }
      }
    } catch (err) {
      alert('Erro ao processar a requisição.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-500/20">
              <StoreIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Painel SiTef</h1>
              <p className="text-sm text-slate-400">Buscador de Clientes e Credenciais</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Cadastrar Novo Cliente</span>
              <span className="sm:hidden">Cadastrar</span>
            </button>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </header>

        <main className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar por CNPJ ou nome da loja..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <th className="px-6 py-4 font-medium">Loja</th>
                  <th className="px-6 py-4 font-medium">CNPJ</th>
                  <th className="px-6 py-4 font-medium">Acesso (Login)</th>
                  <th className="px-6 py-4 font-medium">Senha</th>
                  <th className="px-6 py-4 font-medium w-16 text-center">Editar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex justify-center items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                        Carregando lojas...
                      </div>
                    </td>
                  </tr>
                ) : stores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertCircle className="w-10 h-10 text-slate-600" />
                        <p className="text-lg">Nenhuma loja encontrada.</p>
                        <p className="text-sm text-slate-600">Clique em "Cadastrar Novo Cliente" para adicionar.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.id} className="hover:bg-slate-800/50 transition-colors duration-150 group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-200">{store.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-400 font-mono text-sm">{store.cnpj}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-950 border border-slate-700 text-sm text-indigo-300 font-mono">
                          {store.account.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-400 font-mono text-sm">
                          {store.account.password}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => openEditModal(store)}
                          className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Editar Cliente e Senha"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950/50">
              <h2 className="text-xl font-semibold text-slate-200">
                {isEditMode ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nome da Loja</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Ex: POSTO LOBINHO" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">CNPJ</label>
                <input required type="text" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Ex: 00.000.000/0001-00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">E-mail (SiTef)</label>
                <input 
                  required 
                  type="email" 
                  disabled={isEditMode}
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className={`w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`} 
                  placeholder="Ex: bruno.lyra@bisw.com.br" 
                />
              </div>

              <div>
                <label className="flex justify-between items-end text-sm font-medium text-slate-400 mb-1">
                  <span>Senha (SiTef)</span>
                  {isEditMode && <span className="text-[10px] text-amber-500/80">Altera em todos deste e-mail</span>}
                </label>
                <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Ex: Gt@2026#Tera@" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-600/20">
                  {isEditMode ? 'Salvar Alterações' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

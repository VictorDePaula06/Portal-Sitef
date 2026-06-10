'use client';

import { useState, useEffect } from 'react';
import { Store as StoreIcon, Search, AlertCircle, Plus, X, Pencil, LogOut, Terminal } from 'lucide-react';
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
  isActive: boolean;
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

  const toggleActiveStatus = async (store: Store) => {
    if (!confirm(`Tem certeza que deseja ${store.isActive ? 'INATIVAR' : 'ATIVAR'} a loja ${store.name}?`)) return;
    
    try {
      const res = await fetch('/api/stores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: store.id, toggleActive: true, isActive: !store.isActive })
      });
      if (res.ok) {
        fetchStores(query);
      } else {
        alert('Erro ao alterar status da loja.');
      }
    } catch (err) {
      alert('Erro ao processar a requisição.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const res = await fetch('/api/stores', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchStores(query);
      } else {
        alert('Erro ao processar cliente.');
      }
    } catch (err) {
      alert('Erro ao processar a requisição.');
    }
  };

  return (
    <div className="min-h-screen text-slate-200 font-outfit p-4 md:p-8 relative">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 p-6 glass-card rounded-3xl">
          <div className="flex items-center gap-5 mb-6 md:mb-0">
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-cyan-500 to-purple-600 p-4 rounded-2xl border border-white/20">
                <Terminal className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent tracking-tight">
                Globaltera SiTef
              </h1>
              <p className="text-sm font-medium text-cyan-200/60 uppercase tracking-[0.2em] mt-1">
                Central de Acessos
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={openCreateModal}
              className="group relative overflow-hidden rounded-xl p-[1px] transition-all hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500"></span>
              <div className="relative flex items-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-sm rounded-xl text-white font-medium">
                <Plus className="w-5 h-5 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">Novo Cliente</span>
              </div>
            </button>

            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-5 py-3 glass-panel hover:bg-white/10 rounded-xl transition-all text-white/70 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="glass-card rounded-3xl overflow-hidden flex flex-col">
          
          {/* Search Bar */}
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-5 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors duration-300" />
                <input 
                  type="text" 
                  placeholder="Pesquisar por CNPJ ou nome da loja..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 text-lg font-light backdrop-blur-md"
                />
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-xs uppercase tracking-widest text-white/50 border-b border-white/5">
                  <th className="px-8 py-5 font-semibold">Identificação da Loja</th>
                  <th className="px-8 py-5 font-semibold">CNPJ</th>
                  <th className="px-8 py-5 font-semibold">Acesso SiTef</th>
                  <th className="px-8 py-5 font-semibold">Senha Global</th>
                  <th className="px-8 py-5 font-semibold text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative w-12 h-12">
                          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
                          <div className="absolute inset-2 rounded-full border-b-2 border-purple-500 animate-spin animation-delay-150"></div>
                        </div>
                        <p className="text-cyan-400/70 font-medium tracking-widest uppercase text-sm animate-pulse">Sincronizando Banco de Dados...</p>
                      </div>
                    </td>
                  </tr>
                ) : stores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                          <AlertCircle className="w-8 h-8 text-white/30" />
                        </div>
                        <p className="text-xl font-medium text-white/70">Nenhuma loja localizada.</p>
                        <p className="text-sm text-white/40">Tente buscar por outro termo ou cadastre um novo cliente.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.id} className={`group transition-all duration-300 ${store.isActive ? 'hover:bg-white/[0.03]' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0 bg-black/40'}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`font-medium transition-colors duration-300 ${store.isActive ? 'text-white/90 group-hover:text-cyan-300' : 'text-white/50 line-through decoration-white/20'}`}>
                            {store.name}
                          </div>
                          {!store.isActive && (
                            <span className="text-[10px] uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
                              Inativo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-white/50 font-mono text-sm tracking-wide bg-black/20 px-3 py-1.5 rounded-lg inline-block border border-white/5">
                          {store.cnpj}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-mono tracking-wide ${store.isActive ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' : 'bg-white/5 border-white/10 text-white/40'}`}>
                          {store.account.email}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-white/50 font-mono text-sm tracking-wide flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${store.isActive ? 'bg-purple-500/50' : 'bg-red-500/50'}`}></span>
                          {store.account.password}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => toggleActiveStatus(store)}
                            className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${store.isActive ? 'text-white/30 hover:text-red-400 hover:bg-red-500/10' : 'text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                            title={store.isActive ? "Inativar Cliente" : "Reativar Cliente"}
                          >
                            <X className={`w-4 h-4 ${store.isActive ? '' : 'rotate-45'}`} />
                          </button>
                          <button 
                            onClick={() => openEditModal(store)}
                            disabled={!store.isActive}
                            className={`p-2 rounded-lg transition-all duration-300 transform ${store.isActive ? 'text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 hover:scale-110 active:scale-95' : 'text-white/10 cursor-not-allowed'}`}
                            title={store.isActive ? "Editar Credenciais" : "Reative para editar"}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Glassmorphism Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-md rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

            <div className="flex justify-between items-center p-8 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {isEditMode ? 'Editar Credenciais' : 'Novo Cliente'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-widest text-white/50 uppercase">Nome da Loja</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all" placeholder="Ex: POSTO LOBINHO" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-widest text-white/50 uppercase">CNPJ</label>
                <input required type="text" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white font-mono focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all" placeholder="00.000.000/0001-00" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-widest text-white/50 uppercase">E-mail (SiTef)</label>
                <input 
                  required 
                  type="email" 
                  disabled={isEditMode}
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className={`w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all ${isEditMode ? 'opacity-40 cursor-not-allowed' : ''}`} 
                  placeholder="bruno.lyra@bisw.com.br" 
                />
              </div>

              <div className="space-y-1">
                <label className="flex justify-between items-end text-xs font-semibold tracking-widest text-white/50 uppercase">
                  <span>Senha (SiTef)</span>
                  {isEditMode && <span className="text-[10px] text-cyan-400 lowercase tracking-normal bg-cyan-500/10 px-2 py-0.5 rounded">Atualiza todos do e-mail</span>}
                </label>
                <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white font-mono focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all" placeholder="Gt@2026#Tera@" />
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 glass-panel hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-300">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 relative group overflow-hidden rounded-xl">
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 transition-transform duration-300 group-hover:scale-105"></span>
                  <div className="relative flex items-center justify-center px-4 py-4 font-semibold text-white">
                    {isEditMode ? 'Salvar Edição' : 'Cadastrar Loja'}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

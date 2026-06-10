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
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                Globaltera SiTef
              </h1>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-[0.2em] mt-1">
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

          {/* Cards Grid Area */}
          <div className="p-6 bg-black/20 min-h-[500px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-t-2 border-slate-400 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-b-2 border-slate-600 animate-spin animation-delay-150"></div>
                </div>
                <p className="text-slate-400 font-medium tracking-widest uppercase text-sm animate-pulse">Sincronizando Banco de Dados...</p>
              </div>
            ) : stores.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                  <AlertCircle className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-xl font-medium text-white/70">Nenhuma loja localizada.</p>
                <p className="text-sm text-white/40">Tente buscar por outro termo ou cadastre um novo cliente.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {stores.map((store) => (
                  <div 
                    key={store.id} 
                    className={`glass-panel rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 relative group overflow-hidden ${
                      store.isActive ? 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/5' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                    }`}
                  >
                    {/* Active/Inactive Indicator Top Border */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${store.isActive ? 'bg-gradient-to-r from-emerald-500/50 to-emerald-400/20' : 'bg-red-500/50'}`}></div>

                    {/* Card Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className={`font-semibold text-lg leading-tight transition-colors duration-300 ${store.isActive ? 'text-slate-200 group-hover:text-white' : 'text-slate-400 line-through decoration-slate-500/50'}`}>
                          {store.name}
                        </h3>
                        <p className="text-slate-500 font-mono text-sm mt-1">{store.cnpj}</p>
                      </div>
                      {!store.isActive && (
                        <span className="text-[10px] uppercase tracking-widest bg-red-500/10 text-red-400 px-2.5 py-1 rounded-md border border-red-500/20 whitespace-nowrap">
                          Inativo
                        </span>
                      )}
                    </div>

                    {/* Card Body (Credentials) */}
                    <div className="bg-black/40 rounded-xl p-4 space-y-3 border border-white/5 flex-1">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Acesso SiTef</p>
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-md border text-sm font-mono tracking-wide w-full overflow-hidden text-ellipsis ${store.isActive ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-white/5 border-white/10 text-white/40'}`}>
                          {store.account.email}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Senha Global</p>
                        <div className="text-slate-400 font-mono text-sm tracking-wide flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${store.isActive ? 'bg-emerald-500/50' : 'bg-red-500/50'}`}></span>
                          {store.account.password}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer (Actions) */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5 mt-auto">
                      <button 
                        onClick={() => toggleActiveStatus(store)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                          store.isActive 
                            ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' 
                            : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                        title={store.isActive ? "Inativar Cliente" : "Reativar Cliente"}
                      >
                        <X className={`w-4 h-4 ${store.isActive ? '' : 'rotate-45'}`} />
                        {store.isActive ? 'Inativar' : 'Reativar'}
                      </button>
                      <button 
                        onClick={() => openEditModal(store)}
                        disabled={!store.isActive}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                          store.isActive 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                            : 'bg-black/20 text-slate-600 border border-transparent cursor-not-allowed'
                        }`}
                        title={store.isActive ? "Editar Credenciais" : "Reative para editar"}
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

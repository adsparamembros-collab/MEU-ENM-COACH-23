import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); // Visual only for this demo
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, you would distinguish between login and register API calls
      // For this demo, we treat them similarly to set the user state
      const displayName = isLogin ? (name || email.split('@')[0]) : name;
      await login(email, displayName);
    } catch (error) {
      console.error("Auth error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row animate-fade-in">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="text-slate-500">
              {isLogin 
                ? 'Entre para continuar seus estudos no ENEM Coach.' 
                : 'Comece sua jornada rumo à aprovação hoje mesmo.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-sky-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-sky-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                isLogin ? 'Entrar na Plataforma' : 'Criar Conta Grátis'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="ml-2 font-bold text-sky-600 hover:text-sky-700"
            >
              {isLogin ? 'Cadastre-se' : 'Fazer Login'}
            </button>
          </div>
        </div>

        {/* Right Side - Decorative */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-sky-600 to-indigo-700 p-12 flex flex-col justify-between text-white order-1 md:order-2 relative overflow-hidden">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-400 opacity-20 blur-3xl"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 text-2xl font-bold mb-2">
                    <span className="bg-white text-sky-600 px-2 py-1 rounded">ENEM</span> Coach
                </div>
                <p className="text-sky-100 text-sm">Inteligência Artificial aplicada aos seus estudos.</p>
            </div>

            <div className="relative z-10 mt-12 md:mt-0">
                <h3 className="text-3xl font-bold mb-4 leading-tight">
                    Prepare-se para o futuro com a melhor tecnologia.
                </h3>
                <ul className="space-y-3 text-sky-100">
                    <li className="flex items-center gap-3">
                        <div className="bg-white/20 p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                        Simulados Personalizados
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="bg-white/20 p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                        Correção de Redação Instantânea
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="bg-white/20 p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                        Acompanhamento de Evolução
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};
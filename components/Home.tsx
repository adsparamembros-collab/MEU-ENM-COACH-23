import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const BookOpenIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);
  
const PencilAltIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const ChartBarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface HomeProps {
    onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0];

  return (
    <div className="space-y-8 animate-fade-in pb-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl shadow-2xl text-white p-8 md:p-12 border border-slate-800">
            {/* Abstract Background Pattern */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-600 opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-600 opacity-20 blur-3xl"></div>

            <div className="relative z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-sky-900/50 border border-sky-700/50 text-sky-300 text-xs font-bold tracking-wider uppercase mb-4">
                    Plataforma Inteligente
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                    Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">{firstName}</span>!
                </h1>
                <p className="text-slate-300 text-lg mb-8 max-w-xl leading-relaxed">
                    Sua jornada rumo à aprovação continua. Hoje é um ótimo dia para dominar um novo tópico e superar seus limites.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => onNavigate('questions')}
                        className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-lg py-3.5 px-8 rounded-xl shadow-lg shadow-sky-900/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                    >
                        Começar Simulado
                    </button>
                    <button 
                         onClick={() => onNavigate('essay')}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-lg py-3.5 px-8 rounded-xl border border-white/10 transition-all duration-300"
                    >
                        Corrigir Redação
                    </button>
                </div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button 
                onClick={() => onNavigate('questions')}
                className="flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 group text-left h-full"
            >
                <div className="w-12 h-12 flex items-center justify-center bg-sky-50 rounded-xl mb-4 group-hover:bg-sky-100 transition-colors">
                    <BookOpenIcon className="text-sky-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-sky-700">Questões Ilimitadas</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Gere simulados personalizados por matéria e tópico.
                </p>
            </button>

            <button 
                onClick={() => onNavigate('essay')}
                className="flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 group text-left h-full"
            >
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl mb-4 group-hover:bg-indigo-100 transition-colors">
                    <PencilAltIcon className="text-indigo-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-700">Corretor de Redação</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Feedback detalhado com nota e sugestões em segundos.
                </p>
            </button>
            
             <button 
                onClick={() => onNavigate('videoClasses')}
                className="flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-rose-200 hover:shadow-xl transition-all duration-300 group text-left h-full"
            >
                <div className="w-12 h-12 flex items-center justify-center bg-rose-50 rounded-xl mb-4 group-hover:bg-rose-100 transition-colors">
                    <PlayIcon className="text-rose-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-rose-700">Videoaulas</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Curadoria de conteúdo do YouTube para reforçar o aprendizado.
                </p>
            </button>

            <button 
                onClick={() => onNavigate('evolution')}
                className="flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 group text-left h-full"
            >
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 rounded-xl mb-4 group-hover:bg-emerald-100 transition-colors">
                    <ChartBarIcon className="text-emerald-600 w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-700">Sua Evolução</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Visualize seu progresso com gráficos intuitivos.
                </p>
            </button>
        </div>
    </div>
  );
};
import React from 'react';

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

interface HomeProps {
    onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center border border-slate-100 bg-gradient-to-b from-white to-slate-50">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Sua aprovação no <span className="text-sky-600">ENEM</span> começa aqui.
            </h1>
            <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Utilize o poder da Inteligência Artificial para personalizar seus estudos, corrigir suas redações em segundos e acompanhar sua evolução.
            </p>
            <button 
                onClick={() => onNavigate('questions')}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
                Começar Simulado Agora
            </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
                onClick={() => onNavigate('questions')}
                className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md border border-slate-100 hover:border-sky-200 hover:shadow-lg transition-all duration-300 group text-left md:text-center"
            >
                <div className="p-3 bg-sky-50 rounded-full mb-4 group-hover:bg-sky-100 transition-colors">
                    <BookOpenIcon className="text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Questões Ilimitadas</h3>
                <p className="text-slate-500 text-sm">
                    Gere simulados personalizados por matéria e tópico. Estude exatamente o que você precisa.
                </p>
            </button>

            <button 
                onClick={() => onNavigate('essay')}
                className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md border border-slate-100 hover:border-sky-200 hover:shadow-lg transition-all duration-300 group text-left md:text-center"
            >
                <div className="p-3 bg-indigo-50 rounded-full mb-4 group-hover:bg-indigo-100 transition-colors">
                    <PencilAltIcon className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Corretor de Redação</h3>
                <p className="text-slate-500 text-sm">
                    Feedback detalhado nas 5 competências do ENEM em segundos, com sugestões de melhoria.
                </p>
            </button>

            <button 
                onClick={() => onNavigate('evolution')}
                className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md border border-slate-100 hover:border-sky-200 hover:shadow-lg transition-all duration-300 group text-left md:text-center"
            >
                <div className="p-3 bg-emerald-50 rounded-full mb-4 group-hover:bg-emerald-100 transition-colors">
                    <ChartBarIcon className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Sua Evolução</h3>
                <p className="text-slate-500 text-sm">
                    Visualize seu progresso com gráficos intuitivos e descubra seus pontos fortes.
                </p>
            </button>
        </div>
    </div>
  );
};
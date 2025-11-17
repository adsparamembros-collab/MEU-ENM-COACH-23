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

export const Home: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in text-center">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">
        Bem-vindo ao <span className="text-sky-600">ENEM</span><span className="font-light">Coach</span>!
      </h1>
      <p className="text-slate-500 mb-8 max-w-2xl mx-auto">
        Sua plataforma completa de preparação para o ENEM. Gere simulados, corrija redações e acompanhe seu progresso, tudo em um só lugar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center p-6 bg-slate-50 rounded-lg border border-slate-200">
            <BookOpenIcon className="text-sky-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Questões Ilimitadas</h3>
            <p className="text-slate-500 text-sm">
                Crie simulados personalizados por matéria e tópico para focar nos seus pontos fracos.
            </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-slate-50 rounded-lg border border-slate-200">
            <PencilAltIcon className="text-sky-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Correção de Redação</h3>
            <p className="text-slate-500 text-sm">
                Receba feedback detalhado baseado nas 5 competências do ENEM e melhore sua escrita.
            </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-slate-50 rounded-lg border border-slate-200">
            <ChartBarIcon className="text-sky-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Análise de Desempenho</h3>
            <p className="text-slate-500 text-sm">
                Visualize sua evolução nas matérias com gráficos intuitivos e identifique onde melhorar.
            </p>
        </div>
      </div>
    </div>
  );
};
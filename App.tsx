import React, { useState } from 'react';
import { QuestionGenerator } from './components/QuestionGenerator';
import { EssayCorrector } from './components/EssayCorrector';
import { Home } from './components/Home';
import { Evolution } from './components/Evolution';
import { EnemExams } from './components/EnemExams';
import { VideoClasses } from './components/VideoClasses';

type Tab = 'home' | 'questions' | 'essay' | 'evolution' | 'exams' | 'videoClasses';

const HomeIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BookOpenIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const PencilAltIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ChartBarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const ClipboardListIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'questions':
        return <QuestionGenerator />;
      case 'exams':
        return <EnemExams />;
      case 'essay':
        return <EssayCorrector />;
      case 'videoClasses':
        return <VideoClasses />;
      case 'evolution':
        return <Evolution />;
      default:
        return <Home />;
    }
  };

  const NavButton: React.FC<{ tabName: Tab; label: string; icon: React.ReactElement<{ className?: string }>; isSidebar?: boolean }> = ({ tabName, label, icon, isSidebar = false }) => {
    const isActive = activeTab === tabName;
    
    if (isSidebar) {
        return (
            <button
              onClick={() => setActiveTab(tabName)}
              className={`flex items-center w-full px-4 py-3 font-medium text-sm rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {React.cloneElement(icon, { className: 'mr-3' })}
              {label}
            </button>
        );
    }

    return (
        <button
          onClick={() => setActiveTab(tabName)}
          className={`flex flex-col items-center justify-center text-center w-full px-2 py-2 font-medium text-xs rounded-lg transition-colors duration-200 ${
            isActive
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          {React.cloneElement(icon, { className: 'mb-1' })}
          <span>{label}</span>
        </button>
      );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar for medium screens and up */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-4 space-y-2">
        <div className="flex items-center text-2xl font-bold text-white p-2 mb-6">
             <span className="text-sky-500">ENEM</span><span className="font-light">Coach</span>
        </div>
        <NavButton tabName="home" label="Início" icon={<HomeIcon />} isSidebar />
        <NavButton tabName="questions" label="Gerador de Questões" icon={<BookOpenIcon />} isSidebar />
        <NavButton tabName="exams" label="Simulados ENEM" icon={<ClipboardListIcon />} isSidebar />
        <NavButton tabName="videoClasses" label="Videoaulas" icon={<PlayIcon />} isSidebar />
        <NavButton tabName="essay" label="Corretor de Redação" icon={<PencilAltIcon />} isSidebar />
        <NavButton tabName="evolution" label="Minha Evolução" icon={<ChartBarIcon />} isSidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header for small screens */}
        <header className="bg-white shadow-sm sticky top-0 z-10 md:hidden">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center text-2xl font-bold text-slate-800 mb-4 sm:mb-0">
               <span className="text-sky-600">ENEM</span><span className="font-light">Coach</span>
            </div>
            <div className="w-full sm:w-auto grid grid-cols-3 gap-2 p-1 bg-slate-200 rounded-lg">
               <NavButton tabName="home" label="Início" icon={<HomeIcon />} />
               <NavButton tabName="questions" label="Questões" icon={<BookOpenIcon />} />
               <NavButton tabName="exams" label="Simulados" icon={<ClipboardListIcon />} />
               <NavButton tabName="essay" label="Redação" icon={<PencilAltIcon />} />
               <NavButton tabName="videoClasses" label="Videoaulas" icon={<PlayIcon />} />
               <NavButton tabName="evolution" label="Evolução" icon={<ChartBarIcon />} />
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto p-4 md:p-8">
          {renderContent()}
        </main>

        <footer className="text-center py-4 text-slate-500 text-sm">
          <p>Desenvolvido com IA para potencializar seus estudos.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
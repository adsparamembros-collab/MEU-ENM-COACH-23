import React, { useState } from 'react';
import type { EssayCorrection } from '../types';
import { correctEssay } from '../services/geminiService';

const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-12 animate-fade-in">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-sky-600 mb-6"></div>
      <h3 className="text-xl font-bold text-slate-800">Analisando sua redação...</h3>
      <p className="text-slate-500 max-w-md mt-2">Nossa IA está verificando cada competência detalhadamente.</p>
    </div>
);

const CompetencyCard: React.FC<{ title: string; score: number; feedback: string; index: number }> = ({ title, score, feedback, index }) => {
    const getScoreColor = (s: number) => {
        if (s >= 160) return { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', bar: 'bg-green-500' };
        if (s >= 120) return { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', bar: 'bg-yellow-500' };
        return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500' };
    };

    const styles = getScoreColor(score);

    return (
        <div className={`bg-white border ${styles.border} p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Competência {index}</span>
                    <h4 className="font-bold text-slate-800 text-lg leading-tight">{title}</h4>
                </div>
                <div className={`${styles.bg} ${styles.text} px-3 py-1 rounded-lg font-bold text-lg whitespace-nowrap`}>
                    {score} <span className="text-xs opacity-75">/ 200</span>
                </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mb-4 overflow-hidden">
                <div className={`h-full ${styles.bar}`} style={{ width: `${(score / 200) * 100}%` }}></div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{feedback}</p>
        </div>
    );
};


export const EssayCorrector: React.FC = () => {
  const [essayText, setEssayText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [correction, setCorrection] = useState<EssayCorrection | null>(null);
  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wordCount < 50) {
        setError("A redação deve ter pelo menos 50 palavras para uma análise eficaz.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setCorrection(null);
    try {
      const result = await correctEssay(essayText);
      setCorrection(result);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  if(correction) {
    return (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl animate-fade-in">
             <div className="text-center mb-10 border-b border-slate-100 pb-8">
                 <h2 className="text-3xl font-bold text-slate-900 mb-2">Relatório de Correção</h2>
                 <div className="mt-6 inline-block">
                    <span className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Nota Final</span>
                    <div className="text-7xl font-extrabold text-sky-600 tracking-tighter">{correction.overallScore}</div>
                    <span className="text-slate-400 font-medium">de 1000 pontos</span>
                 </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h4 className="font-bold text-blue-900">Feedback Geral</h4>
                    </div>
                    <p className="text-blue-800 text-sm leading-relaxed">{correction.generalFeedback}</p>
                </div>
                 <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                    <div className="flex items-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <h4 className="font-bold text-amber-900">Onde Melhorar</h4>
                    </div>
                    <p className="text-amber-800 text-sm leading-relaxed">{correction.suggestions}</p>
                </div>
             </div>
             
             <h3 className="text-xl font-bold text-slate-900 mb-6">Detalhamento por Competência</h3>
             <div className="space-y-4">
                <CompetencyCard index={1} title="Domínio da norma culta" score={correction.competency1.score} feedback={correction.competency1.feedback} />
                <CompetencyCard index={2} title="Compreensão da proposta" score={correction.competency2.score} feedback={correction.competency2.feedback} />
                <CompetencyCard index={3} title="Organização das informações" score={correction.competency3.score} feedback={correction.competency3.feedback} />
                <CompetencyCard index={4} title="Coesão e coerência" score={correction.competency4.score} feedback={correction.competency4.feedback} />
                <CompetencyCard index={5} title="Proposta de intervenção" score={correction.competency5.score} feedback={correction.competency5.feedback} />
             </div>
             <div className="text-center mt-12">
                <button onClick={() => setCorrection(null)} className="bg-sky-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-sky-700 transition-all duration-200">
                    Corrigir Nova Redação
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Corretor de Redação</h2>
      <p className="text-slate-500 mb-8">Utilize nossa IA para receber uma correção detalhada e instantânea no modelo ENEM.</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <textarea
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            placeholder="Digite ou cole sua redação aqui. Certifique-se de ter pelo menos 50 palavras..."
            className="w-full h-96 p-6 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-y font-serif text-lg text-slate-700 leading-relaxed transition-all placeholder:text-slate-400 focus:bg-white shadow-inner"
            disabled={isLoading}
          />
          <div className={`absolute bottom-4 right-4 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${wordCount >= 50 ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500'}`}>
            {wordCount} palavras
          </div>
        </div>

        <div className="mt-6 flex justify-end">
            { isLoading ? <div className="w-full"><Loader /></div> : (
                <button 
                    type="submit" 
                    disabled={isLoading || wordCount < 50} 
                    className="w-full md:w-auto bg-sky-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-sky-700 shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                    Enviar para Correção
                </button>
            )}
        </div>
      </form>
    </div>
  );
};
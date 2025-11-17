
import React, { useState } from 'react';
import type { EssayCorrection } from '../types';
import { correctEssay } from '../services/geminiService';

const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-600 mb-4"></div>
      <h3 className="text-xl font-semibold text-slate-700">Corrigindo sua redação...</h3>
      <p className="text-slate-500">Aguarde um momento, nossa IA está realizando uma análise completa.</p>
    </div>
);

const CompetencyCard: React.FC<{ title: string; score: number; feedback: string }> = ({ title, score, feedback }) => {
    const scoreColor = score >= 160 ? 'text-green-600' : score >= 100 ? 'text-yellow-600' : 'text-red-600';
    const bgColor = score >= 160 ? 'bg-green-50' : score >= 100 ? 'bg-yellow-50' : 'bg-red-50';
    const borderColor = score >= 160 ? 'border-green-500' : score >= 100 ? 'border-yellow-500' : 'border-red-500';

    return (
        <div className={`${bgColor} ${borderColor} border-l-4 p-4 rounded-r-lg`}>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-slate-800">{title}</h4>
                <span className={`font-extrabold text-lg ${scoreColor}`}>{score} / 200</span>
            </div>
            <p className="text-slate-600 text-sm">{feedback}</p>
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
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
             <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Análise da Redação</h2>
             <p className="text-slate-500 mb-8 text-center">Confira o feedback detalhado para aprimorar sua escrita.</p>
             
             <div className="mb-8 text-center">
                <p className="text-slate-600">Nota Final</p>
                <p className="text-6xl font-extrabold text-sky-600">{correction.overallScore}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-bold text-slate-800 mb-2">Feedback Geral</h4>
                    <p className="text-slate-600 text-sm">{correction.generalFeedback}</p>
                </div>
                 <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-bold text-slate-800 mb-2">Sugestões de Melhoria</h4>
                    <p className="text-slate-600 text-sm">{correction.suggestions}</p>
                </div>
             </div>
             
             <h3 className="text-xl font-bold text-slate-800 mb-4">Análise por Competência</h3>
             <div className="space-y-4">
                <CompetencyCard title="Competência 1: Domínio da norma culta" score={correction.competency1.score} feedback={correction.competency1.feedback} />
                <CompetencyCard title="Competência 2: Compreensão da proposta" score={correction.competency2.score} feedback={correction.competency2.feedback} />
                <CompetencyCard title="Competência 3: Seleção e organização de informações" score={correction.competency3.score} feedback={correction.competency3.feedback} />
                <CompetencyCard title="Competência 4: Coesão e coerência" score={correction.competency4.score} feedback={correction.competency4.feedback} />
                <CompetencyCard title="Competência 5: Proposta de intervenção" score={correction.competency5.score} feedback={correction.competency5.feedback} />
             </div>
             <div className="text-center mt-8">
                <button onClick={() => setCorrection(null)} className="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-200">
                    Corrigir Outra Redação
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Corretor de Redação</h2>
      <p className="text-slate-500 mb-8">Receba um feedback instantâneo e detalhado sobre sua redação no modelo ENEM.</p>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            placeholder="Cole sua redação aqui..."
            className="w-full h-80 p-4 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-y"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 text-sm text-slate-500 bg-slate-200 px-2 py-1 rounded">
            {wordCount} palavras
          </div>
        </div>

        <div className="mt-6">
            { isLoading ? <Loader /> : (
                <button 
                    type="submit" 
                    disabled={isLoading || wordCount < 50} 
                    className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    Corrigir Redação
                </button>
            )}
        </div>
      </form>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import type { QuizResult } from '../types';

interface SubjectStats {
  subject: string;
  average: number;
  questionCount: number;
}

const Chart: React.FC<{ data: SubjectStats[] }> = ({ data }) => {
  const maxValue = 100;
  
  return (
    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 w-full h-96 flex items-end space-x-2 md:space-x-4">
      {data.map((item, index) => {
        const barHeight = `${item.average}%`;
        return (
          <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
            <div className="relative w-full h-full flex items-end">
              <div
                className="w-full bg-sky-500 hover:bg-sky-600 rounded-t-lg transition-all duration-300"
                style={{ height: barHeight }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.average.toFixed(0)}%
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-500 mt-2 text-center break-words">{item.subject}</span>
          </div>
        );
      })}
    </div>
  );
};


export const Evolution: React.FC = () => {
  const [stats, setStats] = useState<SubjectStats[]>([]);

  useEffect(() => {
    const rawData = localStorage.getItem('enemCoachResults');
    if (rawData) {
      const results: QuizResult[] = JSON.parse(rawData);

      const statsBySubject: { [key: string]: { totalScore: number; totalQuestions: number } } = {};

      results.forEach(result => {
        if (!statsBySubject[result.subject]) {
          statsBySubject[result.subject] = { totalScore: 0, totalQuestions: 0 };
        }
        statsBySubject[result.subject].totalScore += result.score;
        statsBySubject[result.subject].totalQuestions += result.totalQuestions;
      });
      
      const calculatedStats: SubjectStats[] = Object.keys(statsBySubject).map(subject => ({
        subject,
        average: (statsBySubject[subject].totalScore / statsBySubject[subject].totalQuestions) * 100,
        questionCount: statsBySubject[subject].totalQuestions,
      }));
      
      setStats(calculatedStats.sort((a, b) => b.average - a.average));
    }
  }, []);

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Análise de Evolução</h2>
      <p className="text-slate-500 mb-8">Acompanhe seu desempenho médio por matéria.</p>
      
      {stats.length > 0 ? (
        <Chart data={stats} />
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-slate-800">Nenhum dado encontrado</h3>
            <p className="mt-1 text-sm text-slate-500">
                Faça seu primeiro simulado no Gerador de Questões para começar a ver seu progresso!
            </p>
        </div>
      )}
    </div>
  );
};
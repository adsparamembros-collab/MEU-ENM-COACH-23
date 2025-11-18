import React, { useState, useEffect, useMemo } from 'react';
import type { QuizQuestion, QuizResult } from '../types';
import { generateEnemExam } from '../services/geminiService';

const Loader: React.FC<{area: string, year: string}> = ({area, year}) => (
  <div className="flex flex-col items-center justify-center text-center p-12 animate-fade-in">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-sky-600 mb-6"></div>
    <h3 className="text-xl font-bold text-slate-800">Gerando Simulado Oficial...</h3>
    <p className="text-slate-500 max-w-lg mt-2">Estamos compilando 15 questões de <span className="font-semibold">{area}</span> do ano {year}.</p>
  </div>
);

const QuizResults: React.FC<{
  questions: QuizQuestion[];
  userAnswers: (number | null)[];
  onRestart: () => void;
  subject: string;
}> = ({ questions, userAnswers, onRestart, subject }) => {
    const score = useMemo(() => {
        return userAnswers.reduce((acc, answer, index) => {
            return answer === questions[index].correctAnswerIndex ? acc + 1 : acc;
        }, 0);
    }, [userAnswers, questions]);

    useEffect(() => {
        const newResult: QuizResult = {
            subject,
            topic: 'Simulado ENEM Oficial',
            score,
            totalQuestions: questions.length,
            date: new Date().toISOString(),
        };

        const existingResultsRaw = localStorage.getItem('enemCoachResults');
        const existingResults: QuizResult[] = existingResultsRaw ? JSON.parse(existingResultsRaw) : [];
        
        localStorage.setItem('enemCoachResults', JSON.stringify([...existingResults, newResult]));
    }, []);

    const percentage = Math.round((score / questions.length) * 100);

    return (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg animate-fade-in">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Resultado do Simulado</h2>
                <p className="text-slate-500">{subject}</p>
            </div>

            <div className="flex flex-col items-center mb-10">
                <div className="relative">
                     <svg className="w-40 h-40 transform -rotate-90">
                        <circle className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                        <circle 
                            className={`${percentage >= 60 ? 'text-green-500' : 'text-sky-500'} transition-all duration-1000 ease-out`} 
                            strokeWidth="12" 
                            strokeDasharray={440} 
                            strokeDashoffset={440 - (440 * percentage) / 100} 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="70" 
                            cx="80" 
                            cy="80" 
                        />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-slate-800">
                        <span className="text-4xl font-bold">{score}</span>
                        <span className="text-sm text-slate-500">de {questions.length}</span>
                    </div>
                </div>
            </div>
            
            <div className="space-y-6 max-w-4xl mx-auto">
                {questions.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === q.correctAnswerIndex;
                    return (
                        <div key={index} className={`border rounded-xl p-5 ${isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                            <div className="flex items-start gap-3 mb-3">
                                <span className="font-bold text-slate-400 text-sm mt-1">#{index + 1}</span>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-800 mb-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: q.question.replace(/\n/g, '<br />') }}></p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        <div className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'}`}>
                                            <span className="font-bold block text-xs uppercase mb-1">Sua Resposta</span>
                                            {userAnswer !== null ? q.options[userAnswer] : 'Em branco'}
                                        </div>
                                        {!isCorrect && (
                                             <div className="p-3 rounded-lg border bg-white border-slate-200 text-slate-700">
                                                <span className="font-bold block text-xs uppercase mb-1 text-green-600">Correta</span>
                                                {q.options[q.correctAnswerIndex]}
                                            </div>
                                        )}
                                    </div>
                                    {!isCorrect && (
                                        <div className="mt-3 text-xs text-slate-500 bg-white p-3 rounded border border-slate-100">
                                            <span className="font-bold text-slate-700 mr-1">Resolução:</span> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center mt-10">
                <button onClick={onRestart} className="bg-slate-900 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-800 transition-colors duration-200 shadow-lg">
                    Voltar ao Menu de Simulados
                </button>
            </div>
        </div>
    );
};


export const EnemExams: React.FC = () => {
  const [year, setYear] = useState('2023');
  const [area, setArea] = useState('Ciências Humanas e suas Tecnologias');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [quizState, setQuizState] = useState<'config' | 'active' | 'finished'>('config');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const AREAS = ['Linguagens, Códigos e suas Tecnologias', 'Ciências Humanas e suas Tecnologias', 'Ciências da Natureza e suas Tecnologias', 'Matemática e suas Tecnologias'];
  const YEARS = ['2023', '2022', '2021', '2020'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateEnemExam(year, area);
      setQuestions(generated);
      setUserAnswers(new Array(generated.length).fill(null));
      setCurrentQuestionIndex(0);
      setQuizState('active');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
      setQuizState('config');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizState('finished');
        }
    }, 300);
  };
  
  const handleRestart = () => {
    setQuizState('config');
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setError(null);
  }

  const getShortAreaName = (fullArea: string) => {
    if (fullArea.startsWith('Linguagens')) return 'Linguagens';
    if (fullArea.startsWith('Ciências Humanas')) return 'Humanas';
    if (fullArea.startsWith('Ciências da Natureza')) return 'Natureza';
    if (fullArea.startsWith('Matemática')) return 'Matemática';
    return fullArea.split(' ')[0];
  }

  if (isLoading) {
    return <Loader year={year} area={area} />;
  }

  if (quizState === 'finished') {
    return <QuizResults 
        questions={questions} 
        userAnswers={userAnswers} 
        onRestart={handleRestart}
        subject={`${getShortAreaName(area)} (${year})`}
    />;
  }

  if (quizState === 'active' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl animate-fade-in w-full max-w-4xl mx-auto border border-slate-100">
             <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                     <div className="flex items-center">
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded mr-2">QUESTÃO {currentQuestionIndex + 1}</span>
                        <span className="text-xs font-medium text-slate-400 hidden sm:inline">{area} • {year}</span>
                     </div>
                     <span className="text-xs font-bold text-slate-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-sky-600 h-1.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="prose prose-slate max-w-none mb-8">
                <p className="text-lg text-slate-900 font-medium leading-loose" dangerouslySetInnerHTML={{ __html: currentQuestion.question.replace(/\n/g, '<br />') }}></p>
            </div>

            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                     const isSelected = userAnswers[currentQuestionIndex] === index;
                     return (
                         <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-start group hover:shadow-md
                                ${isSelected ? 'bg-sky-50 border-sky-500 shadow-sm' : 'bg-white border-slate-200 hover:border-sky-200 hover:bg-sky-50/30'}`}
                         >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold mr-3 transition-colors ${isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-500 group-hover:border-sky-300 group-hover:text-sky-600'}`}>
                                {String.fromCharCode(65 + index)}
                            </div>
                            <span className={`flex-1 py-1 ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{option}</span>
                         </button>
                    )
                })}
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg animate-fade-in max-w-3xl mx-auto">
      <div className="text-center mb-10">
         <h2 className="text-3xl font-bold text-slate-900 mb-2">Simulados Oficiais</h2>
         <p className="text-slate-500">Pratique com questões reais de provas anteriores do ENEM.</p>
      </div>
      
      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center text-sm" role="alert">{error}</div>}

      <form onSubmit={handleGenerate} className="space-y-6 max-w-lg mx-auto">
        <div>
          <label htmlFor="year" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ano do Exame</label>
          <div className="relative">
            <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none font-medium text-slate-700"
            >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="area" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Área de Conhecimento</label>
          <div className="relative">
            <select
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none font-medium text-slate-700"
            >
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-slate-800 shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all duration-200 disabled:bg-slate-300 disabled:transform-none disabled:shadow-none">
            {isLoading ? 'Processando...' : 'Iniciar Simulado (15 Questões)'}
          </button>
        </div>
      </form>
    </div>
  );
};
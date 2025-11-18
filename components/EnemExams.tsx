import React, { useState, useEffect, useMemo } from 'react';
import type { QuizQuestion, QuizResult } from '../types';
import { generateEnemExam } from '../services/geminiService';

const Loader: React.FC<{area: string, year: string}> = ({area, year}) => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-600 mb-4"></div>
    <h3 className="text-xl font-semibold text-slate-700">Gerando seu Simulado do ENEM...</h3>
    <p className="text-slate-500">Aguarde um momento. Estamos preparando 15 questões selecionadas de {area} do ENEM {year}.</p>
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
            topic: 'Simulado ENEM',
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
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Resultado Final</h2>
            <p className="text-center text-slate-500 mb-6">Veja seu desempenho no simulado de {subject}.</p>
            <div className={`flex items-center justify-center w-32 h-32 mx-auto rounded-full ${percentage >= 70 ? 'bg-green-100' : percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'} mb-6`}>
                <span className={`text-4xl font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{percentage}%</span>
            </div>
            <p className="text-center text-lg text-slate-700 mb-8">Você acertou {score} de {questions.length} questões.</p>
            
            <div className="space-y-4">
                {questions.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === q.correctAnswerIndex;
                    return (
                        <div key={index} className={`border-l-4 p-4 rounded-r-lg ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                            <p className="font-semibold text-slate-800 mb-2" dangerouslySetInnerHTML={{ __html: `${index + 1}. ${q.question.replace(/\n/g, '<br />')}` }}></p>
                            <p className="text-sm text-slate-600">Sua resposta: <span className="font-medium">{userAnswer !== null ? q.options[userAnswer] : 'Não respondida'}</span></p>
                            <p className="text-sm text-slate-600">Resposta correta: <span className="font-medium text-green-700">{q.options[q.correctAnswerIndex]}</span></p>
                            {!isCorrect && (
                                <details className="mt-2 text-sm">
                                    <summary className="cursor-pointer font-medium text-sky-600">Ver explicação</summary>
                                    <p className="mt-1 text-slate-600">{q.explanation}</p>
                                </details>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="text-center mt-8">
                <button onClick={onRestart} className="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-200">
                    Fazer Outro Simulado
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
    }, 500);
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
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in w-full max-w-4xl mx-auto">
             <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-sky-600">Questão {currentQuestionIndex + 1} de {questions.length}</p>
                    <p className="text-sm text-slate-500">{area} - ENEM {year}</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
            </div>

            <p className="text-lg text-slate-800 mb-6 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: currentQuestion.question.replace(/\n/g, '<br />') }}></p>
            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                     const isSelected = userAnswers[currentQuestionIndex] === index;
                     return (
                         <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-start
                                ${isSelected ? 'bg-sky-500 border-sky-500 text-white scale-105 shadow-lg' : 'bg-slate-50 border-slate-200 hover:bg-sky-100 hover:border-sky-300'}`}
                         >
                            <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                            <span className="flex-1">{option}</span>
                         </button>
                    )
                })}
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Simulados Oficiais ENEM</h2>
      <p className="text-slate-500 mb-8">Teste seus conhecimentos com provas completas de anos anteriores geradas por IA.</p>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

      <form onSubmit={handleGenerate} className="space-y-6 max-w-lg mx-auto">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-2">Ano do Exame</label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="area" className="block text-sm font-medium text-slate-700 mb-2">Área de Conhecimento</label>
          <select
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        
        <div>
          <button type="submit" disabled={isLoading} className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-200 disabled:bg-slate-400">
            {isLoading ? 'Gerando...' : 'Iniciar Simulado (15 Questões)'}
          </button>
        </div>
      </form>
    </div>
  );
};
import React, { useState, useEffect, useMemo } from 'react';
import { ENEM_SUBJECTS } from '../constants';
import type { QuizQuestion, QuizResult } from '../types';
import { generateQuestions } from '../services/geminiService';

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-12 animate-fade-in">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-sky-600 mb-6"></div>
    <h3 className="text-xl font-bold text-slate-800">Criando seu simulado...</h3>
    <p className="text-slate-500 max-w-md mt-2">Nossa IA está elaborando questões inéditas baseadas no padrão ENEM para você.</p>
  </div>
);

const QuizResults: React.FC<{
  questions: QuizQuestion[];
  userAnswers: (number | null)[];
  onRestart: () => void;
  subject: string;
  topic: string;
}> = ({ questions, userAnswers, onRestart, subject, topic }) => {
    const score = useMemo(() => {
        return userAnswers.reduce((acc, answer, index) => {
            return answer === questions[index].correctAnswerIndex ? acc + 1 : acc;
        }, 0);
    }, [userAnswers, questions]);

    useEffect(() => {
        const newResult: QuizResult = {
            subject,
            topic,
            score,
            totalQuestions: questions.length,
            date: new Date().toISOString(),
        };

        const existingResultsRaw = localStorage.getItem('enemCoachResults');
        const existingResults: QuizResult[] = existingResultsRaw ? JSON.parse(existingResultsRaw) : [];
        
        localStorage.setItem('enemCoachResults', JSON.stringify([...existingResults, newResult]));
    }, []);

    const percentage = Math.round((score / questions.length) * 100);
    const getScoreColor = (p: number) => {
        if (p >= 80) return 'text-green-600 bg-green-100';
        if (p >= 50) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Resultado Final</h2>
                <p className="text-slate-500">Desempenho em {subject} • {topic}</p>
            </div>
            
            <div className={`flex items-center justify-center w-40 h-40 mx-auto rounded-full ${getScoreColor(percentage).split(' ')[1]} mb-8 shadow-inner`}>
                <div className="text-center">
                    <span className={`text-5xl font-bold ${getScoreColor(percentage).split(' ')[0]}`}>{percentage}%</span>
                    <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Acertos</p>
                </div>
            </div>
            
            <p className="text-center text-lg text-slate-700 mb-10">
                Você acertou <span className="font-bold text-slate-900">{score}</span> de <span className="font-bold text-slate-900">{questions.length}</span> questões.
            </p>
            
            <div className="space-y-6 max-w-3xl mx-auto">
                {questions.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === q.correctAnswerIndex;
                    return (
                        <div key={index} className={`border rounded-xl p-5 transition-all ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                            <div className="flex gap-3">
                                <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${isCorrect ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="font-medium text-slate-800 mb-3 leading-relaxed">{q.question}</p>
                                    <div className="text-sm space-y-1">
                                        <p className="text-slate-600">Sua resposta: <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{userAnswer !== null ? q.options[userAnswer] : 'Não respondida'}</span></p>
                                        {!isCorrect && <p className="text-slate-600">Correta: <span className="font-semibold text-green-700">{q.options[q.correctAnswerIndex]}</span></p>}
                                    </div>
                                    {!isCorrect && (
                                        <div className="mt-3 bg-white/60 p-3 rounded-lg text-sm text-slate-700 border border-slate-200">
                                            <span className="font-bold text-slate-900 block mb-1">Explicação:</span>
                                            {q.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center mt-12">
                <button onClick={onRestart} className="bg-sky-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-sky-700 hover:shadow-xl transition-all duration-200">
                    Gerar Novo Simulado
                </button>
            </div>
        </div>
    );
};


export const QuestionGenerator: React.FC = () => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [subject, setSubject] = useState(Object.keys(ENEM_SUBJECTS)[0]);
  const [topic, setTopic] = useState(ENEM_SUBJECTS[subject][0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [quizState, setQuizState] = useState<'config' | 'active' | 'finished'>('config');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  useEffect(() => {
    setTopic(ENEM_SUBJECTS[subject][0]);
  }, [subject]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateQuestions(subject, topic, numQuestions);
      setQuestions(generated);
      setUserAnswers(new Array(generated.length).fill(null));
      setCurrentQuestionIndex(0);
      setQuizState('active');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
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
    }, 400); 
  };
  
  const handleRestart = () => {
    setQuizState('config');
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setError(null);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (quizState === 'finished') {
    return <QuizResults 
        questions={questions} 
        userAnswers={userAnswers} 
        onRestart={handleRestart}
        subject={subject}
        topic={topic}
    />;
  }

  if (quizState === 'active' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl animate-fade-in w-full max-w-3xl mx-auto border border-slate-100">
             <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                    <span className="text-xs font-bold text-sky-600 tracking-wider uppercase">Questão {currentQuestionIndex + 1} de {questions.length}</span>
                    <span className="text-xs font-medium text-slate-400">{subject}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-sky-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <h2 className="text-xl md:text-2xl text-slate-900 mb-8 font-medium leading-relaxed">{currentQuestion.question}</h2>
            
            <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                     const isSelected = userAnswers[currentQuestionIndex] === index;
                     return (
                         <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start group
                                ${isSelected 
                                    ? 'bg-sky-50 border-sky-500 shadow-md' 
                                    : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50'}`}
                         >
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold mr-4 transition-colors
                                ${isSelected ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 text-slate-500 border-slate-200 group-hover:border-sky-400 group-hover:text-sky-600'}`}>
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className={`flex-1 ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>{option}</span>
                         </button>
                    )
                })}
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Gerador de Questões</h2>
        <p className="text-slate-500">Personalize seu simulado para focar nos seus pontos fracos.</p>
      </div>
      
      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 text-center" role="alert">{error}</div>}

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="space-y-4">
            <div>
            <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">Matéria</label>
            <div className="relative">
                <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none text-slate-700 font-medium transition-shadow"
                >
                    {Object.keys(ENEM_SUBJECTS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            </div>

            <div>
            <label htmlFor="topic" className="block text-sm font-bold text-slate-700 mb-2">Tópico Específico</label>
            <div className="relative">
                <select
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none text-slate-700 font-medium transition-shadow"
                >
                    {ENEM_SUBJECTS[subject].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="numQuestions" className="block text-sm font-bold text-slate-700">Quantidade de Questões</label>
                    <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2 py-1 rounded-md">{numQuestions}</span>
                </div>
                <input
                    id="numQuestions"
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>5</span>
                    <span>30</span>
                </div>
            </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full bg-sky-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-sky-700 shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all duration-200 disabled:bg-slate-300 disabled:transform-none disabled:shadow-none">
            {isLoading ? 'Processando...' : 'Iniciar Simulado'}
          </button>
        </div>
      </form>
    </div>
  );
};
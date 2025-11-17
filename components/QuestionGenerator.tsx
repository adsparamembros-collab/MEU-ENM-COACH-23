import React, { useState, useEffect, useMemo } from 'react';
import { ENEM_SUBJECTS } from '../constants';
import type { QuizQuestion, QuizResult } from '../types';
import { generateQuestions } from '../services/geminiService';

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-600 mb-4"></div>
    <h3 className="text-xl font-semibold text-slate-700">Gerando seu simulado...</h3>
    <p className="text-slate-500">Aguarde um momento, estamos preparando as melhores questões para você.</p>
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
    }, []); // Roda apenas uma vez ao montar o componente de resultados

    const percentage = Math.round((score / questions.length) * 100);

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Resultado Final</h2>
            <p className="text-center text-slate-500 mb-6">Veja seu desempenho no simulado.</p>
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
                            <p className="font-semibold text-slate-800 mb-2">{index + 1}. {q.question}</p>
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
    }, 500); // Short delay to show selection
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
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in w-full max-w-3xl mx-auto">
             <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-sky-600">Questão {currentQuestionIndex + 1} de {questions.length}</p>
                    <p className="text-sm text-slate-500">{subject} - {topic}</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
            </div>

            <p className="text-lg text-slate-800 mb-6 font-medium leading-relaxed">{currentQuestion.question}</p>
            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                     const isSelected = userAnswers[currentQuestionIndex] === index;
                     return (
                         <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                                ${isSelected ? 'bg-sky-500 border-sky-500 text-white scale-105 shadow-lg' : 'bg-slate-50 border-slate-200 hover:bg-sky-100 hover:border-sky-300'}`}
                         >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span> {option}
                         </button>
                    )
                })}
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Gerador de Questões</h2>
      <p className="text-slate-500 mb-8">Personalize seu simulado para focar nos seus estudos.</p>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Matéria</label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            {Object.keys(ENEM_SUBJECTS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-2">Tópico</label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            {ENEM_SUBJECTS[subject].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-700 mb-2">Número de Questões: <span className="font-bold text-sky-600">{numQuestions}</span></label>
          <input
            id="numQuestions"
            type="range"
            min="10"
            max="45"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
        </div>

        <div>
          <button type="submit" disabled={isLoading} className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-200 disabled:bg-slate-400">
            {isLoading ? 'Gerando...' : 'Gerar Simulado'}
          </button>
        </div>
      </form>
    </div>
  );
};
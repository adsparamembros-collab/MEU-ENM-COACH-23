import React, { useState, useEffect } from 'react';
import { ENEM_SUBJECTS } from '../constants';
import type { VideoClass } from '../types';
import { findVideoClasses } from '../services/geminiService';

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-12 animate-fade-in">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-sky-600 mb-6"></div>
    <h3 className="text-xl font-bold text-slate-800">Curando conteúdo...</h3>
    <p className="text-slate-500 mt-2">Buscando as videoaulas mais relevantes no YouTube.</p>
  </div>
);

const VideoCard: React.FC<{ video: VideoClass }> = ({ video }) => (
    <a 
        href={`https://www.youtube.com/watch?v=${video.videoId}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col h-full"
    >
        <div className="relative aspect-video overflow-hidden bg-slate-900">
            <img 
                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} 
                alt={video.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-slate-900 text-lg leading-tight mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">{video.title}</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">{video.description}</p>
            <div className="pt-4 border-t border-slate-100 mt-auto flex justify-end items-center text-xs font-bold text-sky-600 uppercase tracking-wide">
                Assistir no YouTube 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </div>
        </div>
    </a>
);

export const VideoClasses: React.FC = () => {
    const [subject, setSubject] = useState(Object.keys(ENEM_SUBJECTS)[0]);
    const [topic, setTopic] = useState(ENEM_SUBJECTS[subject][0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videos, setVideos] = useState<VideoClass[] | null>(null);

    useEffect(() => {
        setTopic(ENEM_SUBJECTS[subject][0]);
    }, [subject]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setVideos(null);
        try {
            const results = await findVideoClasses(subject, topic);
            setVideos(results);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Videoaulas</h2>
                <p className="text-slate-500">Encontre conteúdo de qualidade curado por IA para seus estudos.</p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex-1">
                    <label htmlFor="subject-video" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Matéria</label>
                    <div className="relative">
                        <select
                            id="subject-video"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none font-medium text-slate-700"
                        >
                            {Object.keys(ENEM_SUBJECTS).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <label htmlFor="topic-video" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tópico</label>
                    <div className="relative">
                        <select
                            id="topic-video"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none font-medium text-slate-700"
                        >
                            {ENEM_SUBJECTS[subject].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div className="flex items-end">
                    <button type="submit" disabled={isLoading} className="w-full md:w-auto bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-700 transition-colors duration-200 disabled:bg-slate-300 shadow-md">
                        {isLoading ? '...' : 'Buscar Aulas'}
                    </button>
                </div>
            </form>

            {isLoading && <Loader />}
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center" role="alert">{error}</div>}
            
            {videos && (
                <div>
                    {videos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {videos.map(video => <VideoCard key={video.videoId} video={video} />)}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                             <p className="text-slate-500">Nenhuma videoaula encontrada. Tente mudar o tópico.</p>
                        </div>
                    )}
                </div>
            )}

            {!videos && !isLoading && !error && (
                 <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Pronto para aprender?</h3>
                    <p className="mt-1 text-slate-500 max-w-xs mx-auto">
                        Selecione a matéria e o tópico acima para encontrar as melhores aulas.
                    </p>
                </div>
            )}
        </div>
    );
};
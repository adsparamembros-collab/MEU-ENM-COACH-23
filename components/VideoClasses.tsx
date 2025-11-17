import React, { useState, useEffect } from 'react';
import { ENEM_SUBJECTS } from '../constants';
import type { VideoClass } from '../types';
import { findVideoClasses } from '../services/geminiService';

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-600 mb-4"></div>
    <h3 className="text-xl font-semibold text-slate-700">Buscando as melhores aulas...</h3>
    <p className="text-slate-500">Aguarde um momento, nossa IA está selecionando os vídeos para você.</p>
  </div>
);

const VideoCard: React.FC<{ video: VideoClass }> = ({ video }) => (
    <a 
        href={`https://www.youtube.com/watch?v=${video.videoId}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
        <div className="relative">
            <img 
                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} 
                alt={video.title}
                className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-300 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white text-opacity-80 group-hover:text-opacity-100 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-slate-800 leading-tight mb-2 group-hover:text-sky-600 transition-colors">{video.title}</h3>
            <p className="text-sm text-slate-600">{video.description}</p>
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
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Videoaulas para o ENEM</h2>
            <p className="text-slate-500 mb-8">Encontre aulas em vídeo sobre tópicos específicos para reforçar seus estudos.</p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-slate-50 rounded-lg border">
                <div className="flex-1">
                    <label htmlFor="subject-video" className="block text-sm font-medium text-slate-700 mb-1">Matéria</label>
                    <select
                        id="subject-video"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                        {Object.keys(ENEM_SUBJECTS).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="topic-video" className="block text-sm font-medium text-slate-700 mb-1">Tópico</label>
                    <select
                        id="topic-video"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                        {ENEM_SUBJECTS[subject].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="flex items-end">
                    <button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-200 disabled:bg-slate-400">
                        {isLoading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
            </form>

            {isLoading && <Loader />}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">{error}</div>}
            
            {videos && (
                <div>
                    {videos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map(video => <VideoCard key={video.videoId} video={video} />)}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-8">Nenhuma videoaula encontrada para este tópico. Tente outros termos.</p>
                    )}
                </div>
            )}

            {!videos && !isLoading && !error && (
                 <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-xl font-medium text-slate-800">Pronto para aprender?</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Selecione a matéria e o tópico acima e clique em "Buscar" para encontrar as melhores aulas.
                    </p>
                </div>
            )}
        </div>
    );
};

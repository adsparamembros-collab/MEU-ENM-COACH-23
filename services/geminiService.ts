import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, EssayCorrection, VideoClass } from '../types';

// VERIFICAÇÃO PARA VERCEL:
// Garante que a chave existe antes de tentar inicializar.
// Se process.env.API_KEY estiver vazia (não configurada na Vercel), o app avisará.
const API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

const checkApiKey = () => {
    if (!API_KEY || API_KEY.includes("YOUR_API_KEY") || API_KEY.length < 10) {
        throw new Error("A Chave de API não está configurada corretamente. No painel da Vercel, vá em Settings > Environment Variables e adicione 'API_KEY'.");
    }
};

const cleanJSON = (text: string) => {
    return text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
};

const handleGenAIError = (error: any) => {
    console.error("GenAI Error:", error);
    if (error.message?.includes("API key") || error.message?.includes("403")) {
        return new Error("Erro de Autenticação: Verifique se a API_KEY está correta nas configurações da Vercel.");
    }
    if (error.message?.includes("503") || error.message?.includes("overloaded")) {
        return new Error("O serviço de IA está temporariamente sobrecarregado. Tente novamente em alguns instantes.");
    }
    return new Error("Ocorreu um erro inesperado na comunicação com a IA.");
};

export const generateQuestions = async (subject: string, topic: string, count: number): Promise<QuizQuestion[]> => {
  checkApiKey();
  try {
    const prompt = `Gere ${count} questões de múltipla escolha no estilo do ENEM sobre a matéria "${subject}" com foco no tópico "${topic}". Cada questão deve ter 4 opções de resposta (A, B, C, D). Forneça o índice da resposta correta e uma breve explicação.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "O enunciado da questão." },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Uma lista com 4 opções de resposta."
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "O índice (0 a 3) da resposta correta." },
              explanation: { type: Type.STRING, description: "Uma breve explicação sobre a resposta correta." }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          },
        },
      },
    });

    const jsonText = cleanJSON(response.text || "[]");
    const questions = JSON.parse(jsonText);
    return questions as QuizQuestion[];

  } catch (error) {
    throw handleGenAIError(error);
  }
};

export const correctEssay = async (essayText: string): Promise<EssayCorrection> => {
    checkApiKey();
    try {
        const prompt = `Aja como um corretor experiente do ENEM. Analise a seguinte redação e forneça uma avaliação detalhada com base nas 5 competências do ENEM. Para cada competência, atribua uma nota de 0 a 200 (em intervalos de 40 pontos) e um feedback construtivo. Forneça também uma nota geral (soma das competências), um feedback geral encorajador e sugestões práticas de melhoria. A redação é: "${essayText}"`;

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                temperature: 0.7,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallScore: { type: Type.INTEGER, description: "Nota geral de 0 a 1000." },
                        competency1: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.INTEGER, description: "Nota de 0 a 200." },
                                feedback: { type: Type.STRING, description: "Feedback sobre a competência 1." }
                            }
                        },
                        competency2: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.INTEGER, description: "Nota de 0 a 200." },
                                feedback: { type: Type.STRING, description: "Feedback sobre a competência 2." }
                            }
                        },
                        competency3: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.INTEGER, description: "Nota de 0 a 200." },
                                feedback: { type: Type.STRING, description: "Feedback sobre a competência 3." }
                            }
                        },
                        competency4: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.INTEGER, description: "Nota de 0 a 200." },
                                feedback: { type: Type.STRING, description: "Feedback sobre a competência 4." }
                            }
                        },
                        competency5: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.INTEGER, description: "Nota de 0 a 200." },
                                feedback: { type: Type.STRING, description: "Feedback sobre a competência 5." }
                            }
                        },
                        generalFeedback: { type: Type.STRING, description: "Um parágrafo com feedback geral sobre a redação." },
                        suggestions: { type: Type.STRING, description: "Um parágrafo com sugestões para melhorar a redação." }
                    },
                    required: ["overallScore", "competency1", "competency2", "competency3", "competency4", "competency5", "generalFeedback", "suggestions"]
                },
            },
        });

        const jsonText = cleanJSON(response.text || "{}");
        const correction = JSON.parse(jsonText);
        return correction as EssayCorrection;

    } catch (error) {
        throw handleGenAIError(error);
    }
};

export const generateEnemExam = async (year: string, area: string): Promise<QuizQuestion[]> => {
    checkApiKey();
    try {
        const prompt = `Gere um simulado resumido da prova de '${area}' do ENEM ${year}. O simulado deve conter exatamente 15 questões de múltipla escolha com 5 opções de resposta cada (A, B, C, D, E). As questões devem ser fiéis ao estilo, nível de dificuldade e distribuição de conteúdo do exame real daquele ano. Para cada questão, forneça o enunciado, as 5 opções, o índice da resposta correta (0 a 4) e uma explicação detalhada da resolução.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                temperature: 0.3,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: "O enunciado da questão." },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "Uma lista com 5 opções de resposta."
                            },
                            correctAnswerIndex: { type: Type.INTEGER, description: "O índice (0 a 4) da resposta correta." },
                            explanation: { type: Type.STRING, description: "Uma explicação detalhada sobre a resposta correta e a resolução." }
                        },
                        required: ["question", "options", "correctAnswerIndex", "explanation"]
                    },
                },
            },
        });

        const jsonText = cleanJSON(response.text || "[]");
        const questions = JSON.parse(jsonText);
        if (!Array.isArray(questions) || questions.length === 0 || !questions[0].options) {
             throw new Error("Formato de resposta inválido. Tente novamente.");
        }
        return questions as QuizQuestion[];

    } catch (error) {
        throw handleGenAIError(error);
    }
};

export const findVideoClasses = async (subject: string, topic: string): Promise<VideoClass[]> => {
    checkApiKey();
    try {
        const prompt = `Encontre as 3 melhores videoaulas no YouTube sobre "${topic}" da matéria "${subject}" para o ENEM. Retorne uma lista com o ID do vídeo, um título conciso e uma breve descrição (máximo 2 frases) para cada aula.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.4,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            videoId: { type: Type.STRING, description: "O ID do vídeo do YouTube (ex: d1-UX6aR_4)." },
                            title: { type: Type.STRING, description: "Um título curto e informativo para a videoaula." },
                            description: { type: Type.STRING, description: "Uma descrição concisa da aula em até 2 frases." }
                        },
                        required: ["videoId", "title", "description"]
                    },
                },
            },
        });

        const jsonText = cleanJSON(response.text || "[]");
        const videoClasses = JSON.parse(jsonText);
        return videoClasses as VideoClass[];

    } catch (error) {
        throw handleGenAIError(error);
    }
};
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração para processar React e substituir process.env.API_KEY pela variável de ambiente da Vercel
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
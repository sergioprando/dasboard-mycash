import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const msg = '⚠️ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas.\nConfigure-as nas variáveis de ambiente do Vercel.'
  console.error(msg)
  // Mostra mensagem amigável ao invés de tela branca
  document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center;padding:2rem"><div><h2 style="color:#e53e3e">Configuração incompleta</h2><p style="color:#4a5568;margin-top:1rem">As variáveis de ambiente do Supabase não foram configuradas.<br/>Configure <b>VITE_SUPABASE_URL</b> e <b>VITE_SUPABASE_ANON_KEY</b> no painel da Vercel.</p></div></div>`
  })
  throw new Error(msg)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

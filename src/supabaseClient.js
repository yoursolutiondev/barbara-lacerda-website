// supabaseClient.js
// Configuração do cliente Supabase

import { createClient } from '@supabase/supabase-js'

// Credenciais do Supabase via variáveis de ambiente
// Configure no arquivo .env.local (ver .env.example)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Validação
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Configuração do Supabase faltando!')
  console.error('Crie um arquivo .env.local com:')
  console.error('REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co')
  console.error('REACT_APP_SUPABASE_ANON_KEY=sua-chave-aqui')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper para verificar se usuário é admin
export const isAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.user_metadata?.role === 'admin'
}

// Helper para login de admin
export const signInAdmin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Helper para logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Helper para obter usuário atual
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
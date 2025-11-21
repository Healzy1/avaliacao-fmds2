import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const router = useRouter()

  // Login com Google
  const loginGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) alert("Erro no login: " + error.message)
  }

  // Logout
  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    // Força o redirecionamento (usando window para garantir limpeza total)
    window.location.href = '/login'
  }

  // Verificar Sessão (Importante para o Guard)
  const checkUser = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      user.value = data.session.user
    }
    return user.value
  }

  return { user, loginGoogle, logout, checkUser }
})
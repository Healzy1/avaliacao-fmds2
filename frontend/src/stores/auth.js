import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

// Login com Google (Forçando escolha de conta)
  const loginGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    })
    if (error) console.error("Erro login:", error)
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    window.location.href = '/login' // Força limpeza total
  }

  async function checkUser() {
    const { data } = await supabase.auth.getSession()
    if (data.session) user.value = data.session.user
  }

  return { user, loginGoogle, logout, checkUser }
})
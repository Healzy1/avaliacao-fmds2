<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <div style="padding: 50px; text-align: center;">
    <h1>🔐 Acesso Restrito</h1>
    <p>Você precisa logar para acessar o sistema de filmes.</p>
    
    <button 
      @click="auth.loginGoogle()" 
      style="padding: 10px 20px; background-color: #4285F4; color: white; border: none; cursor: pointer; font-size: 16px;">
      Entrar com Google
    </button>
    
    <p style="color: orange; margin-top: 20px;">
      (Icaro: Deixe isso bonito depois, por favor)
    </p>
  </div>
</template>
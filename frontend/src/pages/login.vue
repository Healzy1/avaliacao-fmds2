<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>
<template>
  <v-container class="fill-height justify-center">
    <v-card width="400" elevation="12" class="text-center pa-5">
      <v-icon size="60" color="deep-purple" class="mb-4">mdi-movie-check</v-icon>
      
      <v-card-title class="text-h5 font-weight-bold">CineShare</v-card-title>
      
      <v-card-text>Faça login para gerenciar a lista.</v-card-text>
      <v-btn block color="primary" size="large" prepend-icon="mdi-google" @click="auth.loginGoogle" class="mt-4">
        Entrar com Google
      </v-btn>
    </v-card>
  </v-container>
</template>
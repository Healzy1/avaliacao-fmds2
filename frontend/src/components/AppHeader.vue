<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Define que este componente pode emitir um evento para o pai
defineEmits(['toggle-rail'])

const auth = useAuthStore()

// Lógica da Foto
const userPhotoUrl = computed(() => {
  const metadata = auth.user?.user_metadata
  if (!metadata) return null
  return metadata.avatar_url || metadata.picture || null
})
</script>

<template>
  <v-app-bar app color="grey-darken-4" elevation="2">
    
    <v-app-bar-nav-icon @click="$emit('toggle-rail')" v-if="auth.user"></v-app-bar-nav-icon>

    <div class="d-flex align-center ml-2">
       <v-icon icon="mdi-movie-open" class="mr-2"></v-icon>
       <span class="font-weight-bold text-h6">CineShare</span>
    </div>

    <v-spacer></v-spacer>

    <div v-if="auth.user" class="d-flex align-center mr-4">
      
      <div class="text-right mr-3 d-none d-sm-block">
        <div class="text-subtitle-2 font-weight-bold">
          {{ auth.user.user_metadata?.full_name || 'Usuário' }}
        </div>
        <div class="text-caption opacity-80" style="line-height: 1;">
          {{ auth.user.email }}
        </div>
      </div>

      <v-avatar size="40" class="mr-3" color="surface-variant" style="border: 2px solid rgba(255,255,255,0.5)">
        <v-img 
          v-if="userPhotoUrl" 
          :src="userPhotoUrl" 
          referrerpolicy="no-referrer"
          cover
        ></v-img>
        <v-icon v-else>mdi-account</v-icon>
      </v-avatar>

      <v-divider vertical inset class="mx-2 bg-white d-none d-sm-block"></v-divider>

      <v-tooltip text="Sair do Sistema" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn 
            icon="mdi-logout" 
            variant="text" 
            color="white" 
            v-bind="props" 
            @click="auth.logout"
          ></v-btn>
        </template>
      </v-tooltip>
    </div>
  </v-app-bar>
</template>
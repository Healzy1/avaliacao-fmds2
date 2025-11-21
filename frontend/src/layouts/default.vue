<script setup>
  import { ref, onMounted } from 'vue'
  import { useAuthStore } from '@/stores/auth'

  const drawer = ref(true)
  const auth = useAuthStore()

  onMounted(() => {
    auth.checkUser()
  })
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" v-if="auth.user">
      <v-sheet color="grey-lighten-4" class="pa-4">
        <v-avatar class="mb-4" color="grey-darken-1" size="64">
          <v-img 
            v-if="auth.user?.user_metadata?.avatar_url || auth.user?.user_metadata?.picture" 
            :src="auth.user.user_metadata.avatar_url || auth.user.user_metadata.picture"
            referrerpolicy="no-referrer"
          ></v-img>
          <v-icon v-else icon="mdi-account"></v-icon>
        </v-avatar>

        <div class="font-weight-bold">{{ auth.user?.user_metadata?.full_name || 'Usuário' }}</div>
        <div class="text-caption">{{ auth.user?.email }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-filmstrip" title="Gerenciar Filmes" to="/filmes"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="blue-darken-3">
      <v-app-bar-nav-icon v-if="auth.user" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>CineApp FMD</v-app-bar-title>
      <template v-slot:append>
        <v-btn v-if="auth.user" icon="mdi-logout" @click="auth.logout" title="Sair"></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
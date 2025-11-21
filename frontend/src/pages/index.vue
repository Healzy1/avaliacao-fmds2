<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <v-container>
    <h1>🏠 Dashboard</h1>
    <p class="mb-4">Bem-vindo, <strong>{{ auth.user?.user_metadata?.full_name || auth.user?.email }}</strong>!</p>
    
    !!! Colocar os ultimos filmes adicionados/ com mais notas algo assim pra povoar o dashboard !!!

    <v-row class="mt-5">
      <v-col cols="12" md="6">
        <v-card color="blue-grey-darken-3" to="/filmes" hover>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5">Filmes</v-card-title>
              <v-card-subtitle>Acessar o CRUD</v-card-subtitle>
              <v-card-actions>
                <v-btn class="ms-2" variant="outlined" size="small">Gerenciar</v-btn>
              </v-card-actions>
            </div>
            <v-avatar class="ma-3" size="125" rounded="0">
              <v-icon size="80">mdi-filmstrip</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
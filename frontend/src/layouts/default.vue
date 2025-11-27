<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDisplay } from 'vuetify'

// Componentes
import MenuList from '@/components/MenuList.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

// mdAndUp: Verdadeiro se a tela for > 960px (Laptop/PC)
// smAndDown: Verdadeiro se a tela for < 960px (Tablet/Celular)
const { mdAndUp } = useDisplay()
const auth = useAuthStore()

// --- ESTADO ---
// No PC (mdAndUp), o menu sempre existe (true). No Mobile, começa fechado.
const drawer = ref(mdAndUp.value) 
const rail = ref(false)

// --- LÓGICA DO BOTÃO ---
function toggleMenu() {
  if (mdAndUp.value) {
    // SE FOR PC: Apenas encolhe/expande (Rail)
    rail.value = !rail.value
  } else {
    // SE FOR MOBILE: Abre ou Fecha o menu
    drawer.value = !drawer.value
  }
}

onMounted(() => auth.checkUser())
</script>

<template>
  <v-app id="inspire">
    
    <AppHeader @toggle-rail="toggleMenu" />

    <v-navigation-drawer 
      v-model="drawer" 
      :permanent="mdAndUp"
      :temporary="!mdAndUp"
      :rail="mdAndUp && rail"
      v-if="auth.user"
    >
      <MenuList />
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>
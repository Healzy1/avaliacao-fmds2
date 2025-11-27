<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const menuItems = ref([
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
  { title: 'Catálogo Global', icon: 'mdi-filmstrip', to: '/filmes' },
])

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) theme.global.name.value = savedTheme
})
</script>

<template>
  <v-list density="compact" nav class="mt-2">
    <v-list-item 
      v-for="item in menuItems"
      :key="item.to"
      :prepend-icon="item.icon" 
      :title="item.title" 
      :to="item.to" 
      color="primary"
    ></v-list-item>

    <v-divider class="my-2"></v-divider>

    <v-list-item @click="toggleTheme">
      <template v-slot:prepend>
        <v-icon :icon="theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-weather-sunny'"></v-icon>
      </template>
      <v-list-item-title>Alternar Tema</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFilmesStore = defineStore('filmes', () => {
  const filmes = ref([])
  const loading = ref(false)

  // URL do Backend
  const API_URL = 'http://localhost:3000' 

  async function buscarFilmes() {
    loading.value = true
    try {
      const res = await fetch(`${API_URL}/filmes`)
      filmes.value = await res.json()
    } catch (e) { console.error(e) } 
    finally { loading.value = false }
  }

  async function adicionarFilme(filme) {
    await fetch(`${API_URL}/filmes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme)
    })
    await buscarFilmes()
  }

  async function atualizarFilme(id, filme) {
    await fetch(`${API_URL}/filmes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme)
    })
    await buscarFilmes()
  }

  async function removerFilme(id) {
    await fetch(`${API_URL}/filmes/${id}`, { method: 'DELETE' })
    await buscarFilmes()
  }

  return { filmes, loading, buscarFilmes, adicionarFilme, atualizarFilme, removerFilme }
})
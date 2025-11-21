import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFilmesStore = defineStore('filmes', () => {
  const filmes = ref([])
  const loading = ref(false)
  const erro = ref(null)

  // 1. LISTAR (GET)
  const buscarFilmes = async () => {
    loading.value = true
    erro.value = null
    try {
      const req = await fetch('http://localhost:3000/filmes')
      filmes.value = await req.json()
    } catch (e) {
      console.error("Erro:", e)
      erro.value = "Erro ao conectar no servidor Express"
    } finally {
      loading.value = false
    }
  }

  // 2. ADICIONAR (POST)
  const adicionarFilme = async (dados) => {
    try {
      await fetch('http://localhost:3000/filmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      })
      await buscarFilmes()
    } catch (e) {
      console.error(e)
    }
  }

  // 3. ATUALIZAR (PUT) - Adicionado agora!
  const atualizarFilme = async (id, dados) => {
    try {
      await fetch(`http://localhost:3000/filmes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      })
      await buscarFilmes() // Atualiza a lista para mostrar a mudança
    } catch (e) {
      console.error(e)
    }
  }

  // 4. REMOVER (DELETE)
  const removerFilme = async (id) => {
    try {
      await fetch(`http://localhost:3000/filmes/${id}`, { method: 'DELETE' })
      await buscarFilmes()
    } catch (e) {
      console.error(e)
    }
  }

  return { 
    filmes, 
    loading, 
    erro, 
    buscarFilmes, 
    adicionarFilme, 
    atualizarFilme,
    removerFilme 
  }
})
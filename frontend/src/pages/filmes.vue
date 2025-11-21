<script setup>
import { onMounted, ref } from 'vue'
import { useFilmesStore } from '@/stores/filmes'

const store = useFilmesStore()

// Variável para criar NOVO filme
const novoFilme = ref({ titulo: '', genero: '', ano: 2025, nota: 5, status: 'quero ver', capa_url: '' })

// Variável para controlar a EDIÇÃO (se tiver algo aqui, mostra o form de edição)
const filmeEmEdicao = ref(null)

// Função que preenche o formulário de edição com os dados do filme clicado
const prepararEdicao = (filme) => {
  // Usamos {...} para criar uma cópia e não alterar a lista visualmente antes de salvar
  filmeEmEdicao.value = { ...filme }
}

// Função que manda as alterações para o Back
const salvarAlteracoes = async () => {
  await store.atualizarFilme(filmeEmEdicao.value.id, filmeEmEdicao.value)
  filmeEmEdicao.value = null // Fecha o editor
}

onMounted(() => {
  store.buscarFilmes()
})
</script>

<template>
  <div style="padding: 20px; background-color: #121212; color: white; min-height: 100vh;">
    <h1>🎬 Gestão de Filmes</h1>
    <router-link to="/" style="color: cyan;">Voltar para Dashboard</router-link>
    <hr style="margin: 20px 0;">

    <div style="border: 1px solid lime; padding: 15px; margin-bottom: 20px;">
        <h3 style="color: lime;">➕ Novo Filme</h3>
        <input v-model="novoFilme.titulo" placeholder="Título" style="display: block; margin: 5px;">
        <input v-model="novoFilme.genero" placeholder="Gênero" style="display: block; margin: 5px;">
        <input v-model="novoFilme.ano" type="number" placeholder="Ano" style="display: block; margin: 5px;">
        <input v-model="novoFilme.capa_url" placeholder="URL da Capa" style="display: block; margin: 5px;">
        <button @click="store.adicionarFilme(novoFilme)" style="background: lime; padding: 5px;">Salvar (POST)</button>
    </div>

    <div v-if="filmeEmEdicao" style="border: 1px solid orange; padding: 15px; margin-bottom: 20px; background: #332200;">
        <h3 style="color: orange;">✏️ Editando: {{ filmeEmEdicao.titulo }}</h3>
        
        <label>Título:</label>
        <input v-model="filmeEmEdicao.titulo" style="display: block; margin: 5px;">
        
        <label>Nota (1-5):</label>
        <input v-model="filmeEmEdicao.nota" type="number" max="5" min="1" style="display: block; margin: 5px;">
        
        <label>Status:</label>
        <select v-model="filmeEmEdicao.status" style="display: block; margin: 5px;">
            <option value="quero ver">Quero Ver</option>
            <option value="assistido">Assistido</option>
        </select>

        <button @click="salvarAlteracoes" style="background: orange; margin-right: 10px;">Atualizar (PUT)</button>
        <button @click="filmeEmEdicao = null">Cancelar</button>
    </div>

    <div v-if="store.loading">Carregando...</div>
    <ul v-else>
      <li v-for="filme in store.filmes" :key="filme.id" style="margin-bottom: 10px; border-bottom: 1px solid #333; padding: 10px;">
        
        <img :src="filme.capa_url" style="height: 50px; vertical-align: middle;" />
        <strong>{{ filme.titulo }}</strong> ({{ filme.ano }}) - ⭐ {{ filme.nota }} - [{{ filme.status }}]
        
        <div style="display: inline-block; margin-left: 20px;">
            <button @click="prepararEdicao(filme)" style="background: orange; margin-right: 5px; cursor: pointer;">
                Editar
            </button>

            <button @click="store.removerFilme(filme.id)" style="background: red; color: white; cursor: pointer;">
                Excluir
            </button>
        </div>

      </li>
    </ul>
  </div>
</template>
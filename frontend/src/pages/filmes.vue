<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFilmesStore } from '@/stores/filmes'

// Componentes
import FilmeCard from '@/components/FilmeCard.vue'
import FilmeFormDialog from '@/components/FilmeFormDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const store = useFilmesStore()

// --- ESTADOS DE CONTROLE ---
const modoVisualizacao = ref('grid') // 'grid' ou 'list'
const dialogForm = ref(false)
const dialogDelete = ref(false)
const filmeSelecionado = ref(null)
const snackbar = ref({ visible: false, text: '', color: '' })

// --- EFEITOS VISUAIS (SEU CÓDIGO ANTIGO) ---
const flashingId = ref(null)

// --- FILTROS ---
const termoBusca = ref('')
const ordenacao = ref('titulo-asc')
const opcoesOrdenacao = [
  { texto: 'Título (A-Z)', valor: 'titulo-asc' },
  { texto: 'Nota (Maior)', valor: 'nota-desc' },
]

// --- TABELA HEADERS ---
const headers = [
  { title: 'Capa', key: 'capa', sortable: false, width: '80px' },
  { title: 'Título', key: 'titulo', align: 'start' },
  { title: 'Gênero', key: 'genero', align: 'center' },
  { title: 'Ano', key: 'ano', align: 'center' },
  { title: 'Nota', key: 'nota', align: 'center', width: '200px' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

// --- CORES (SEU CÓDIGO ANTIGO) ---
const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'purple', 'teal', 'orange']
const getColorForGenre = (genero) => {
  if (!genero) return 'grey'
  let hash = 0
  for (let i = 0; i < genero.length; i++) hash = genero.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash % colors.length)]
}

const getNotaColor = (nota) => {
  if (nota >= 8) return 'success'
  if (nota >= 5) return 'warning'
  return 'error'
}

// --- LÓGICA DE FILTRO ---
const filmesLista = computed(() => {
  let lista = [...store.filmes]
  
  if (termoBusca.value) {
    lista = lista.filter(f => f.titulo.toLowerCase().includes(termoBusca.value.toLowerCase()))
  }

  switch (ordenacao.value) {
    case 'titulo-asc': lista.sort((a, b) => a.titulo.localeCompare(b.titulo)); break;
    case 'nota-desc': lista.sort((a, b) => (b.nota || 0) - (a.nota || 0)); break;
  }
  return lista
})

// --- LÓGICA DE EFEITOS NA TABELA ---
const getRowProps = ({ item }) => {
  if (item.id === flashingId.value) return { class: 'flash-row' }
  return {}
}

// --- AÇÕES DO CRUD ---
function abrirNovo() {
  filmeSelecionado.value = { titulo: '', genero: '', ano: 2025, nota: 0, status: 'Quero ver', capa_url: '' }
  dialogForm.value = true
}

function abrirEditar(filme) {
  filmeSelecionado.value = { ...filme }
  dialogForm.value = true
}

function abrirExcluir(filme) {
  filmeSelecionado.value = filme
  dialogDelete.value = true
}

async function salvarFilme(filme) {
  try {
    if (filme.id) {
      await store.atualizarFilme(filme.id, filme)
      // Efeito visual de piscar
      flashingId.value = filme.id
      setTimeout(() => flashingId.value = null, 1500)
      showSnackbar('Filme atualizado com sucesso!', 'success')
    } else {
      await store.adicionarFilme(filme)
      showSnackbar('Filme criado com sucesso!', 'success')
    }
    dialogForm.value = false
  } catch (e) {
    showSnackbar('Erro ao salvar.', 'error')
  }
}

async function confirmarExclusao() {
  await store.removerFilme(filmeSelecionado.value.id)
  dialogDelete.value = false
  showSnackbar('Filme removido.', 'info')
}

function showSnackbar(text, color) {
  snackbar.value = { visible: true, text, color }
}

onMounted(() => store.buscarFilmes())
</script>

<template>
  <v-container>
    <v-row class="align-center mb-2">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold">Filmes da Comunidade</h1>
        <p class="text-subtitle-1 text-grey">Gerencie o catálogo comunitário</p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end align-center gap-2">
        <v-btn-toggle v-model="modoVisualizacao" mandatory color="primary" variant="outlined" class="mr-3">
          <v-btn value="grid" icon="mdi-view-grid"></v-btn>
          <v-btn value="list" icon="mdi-view-list"></v-btn>
        </v-btn-toggle>
        
        <v-btn color="green" prepend-icon="mdi-plus" size="large" @click="abrirNovo" elevation="4">
          Novo Filme
        </v-btn>
      </v-col>
    </v-row>

    <v-divider class="mb-4"></v-divider>

    <v-row class="mb-2">
      <v-col cols="12" md="8">
        <v-text-field v-model="termoBusca" label="Buscar filme..." prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select v-model="ordenacao" :items="opcoesOrdenacao" item-title="texto" item-value="valor" label="Ordenar" variant="outlined" density="compact" hide-details prepend-inner-icon="mdi-sort"></v-select>
      </v-col>
    </v-row>

    <v-progress-linear v-if="store.loading" indeterminate color="primary" class="mb-4"></v-progress-linear>

    <v-window v-model="modoVisualizacao">
      <v-window-item value="grid">
        <v-row>
          <v-col v-for="filme in filmesLista" :key="filme.id" cols="12" sm="6" md="4" lg="3">
            <FilmeCard :filme="filme" @editar="abrirEditar" @excluir="abrirExcluir" />
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="list">
        <v-card elevation="2">
          <v-data-table
            :headers="headers"
            :items="filmesLista"
            :row-props="getRowProps"
            hover
          >
            <template v-slot:item.capa="{ item }">
                <v-avatar rounded="0">
                    <v-img :src="item.capa_url || 'https://placehold.co/50'" cover></v-img>
                </v-avatar>
            </template>

            <template v-slot:item.genero="{ item }">
              <v-chip :color="getColorForGenre(item.genero)" size="small" variant="elevated" class="font-weight-bold">
                {{ item.genero }}
              </v-chip>
            </template>

            <template v-slot:item.nota="{ item }">
              <div class="d-flex align-center" style="width: 100%">
                <v-progress-linear
                  :model-value="item.nota * 10"
                  :color="getNotaColor(item.nota)"
                  height="8"
                  rounded
                  class="flex-grow-1 mr-2"
                ></v-progress-linear>
                <span class="font-weight-bold">{{ item.nota }}</span>
              </div>
            </template>

            <template v-slot:item.status="{ item }">
                <v-chip size="small" :color="item.status === 'Assistido' ? 'green' : 'grey'">
                    {{ item.status }}
                </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn icon="mdi-pencil" variant="text" color="orange" size="small" @click="abrirEditar(item)"></v-btn>
              <v-btn icon="mdi-delete" variant="text" color="red" size="small" @click="abrirExcluir(item)"></v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
    </v-window>

    <div v-if="filmesLista.length === 0 && !store.loading" class="text-center mt-10 text-grey">
        <v-icon size="64">mdi-movie-search-outline</v-icon>
        <p>Nenhum filme encontrado.</p>
    </div>

    <FilmeFormDialog 
      :dialog="dialogForm" 
      :item="filmeSelecionado" 
      @update:dialog="dialogForm = $event" 
      @salvar="salvarFilme" 
    />

    <ConfirmDialog 
      :dialog="dialogDelete" 
      title="Excluir Filme" 
      :message="`Deseja realmente apagar '${filmeSelecionado?.titulo}'?`"
      @update:dialog="dialogDelete = $event"
      @cancel="dialogDelete = false"
      @confirm="confirmarExclusao" 
    />

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" location="bottom right" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.visible = false">Fechar</v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<style scoped>
/* Animação de Piscar para a Tabela */
.flash-row {
  animation: blink-effect 1.5s ease-in-out;
}

@keyframes blink-effect {
  0% { background-color: transparent; }
  25% { background-color: rgba(var(--v-theme-success), 0.25); }
  50% { background-color: transparent; }
  75% { background-color: rgba(var(--v-theme-success), 0.25); }
  100% { background-color: transparent; }
}
</style>
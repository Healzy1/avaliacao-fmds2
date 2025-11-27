<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFilmesStore } from '@/stores/filmes'

const auth = useAuthStore()
const store = useFilmesStore()

// Carrega os filmes ao abrir o dashboard para calcular as métricas
onMounted(() => {
  store.buscarFilmes()
})

// --- COMPUTED PROPERTIES (MÉTRICAS) ---

const totalFilmes = computed(() => store.filmes.length)

// Média Geral
const mediaGeralNotas = computed(() => {
  if (totalFilmes.value === 0) return '0.0'
  const soma = store.filmes.reduce((acc, filme) => acc + Number(filme.nota), 0)
  return (soma / totalFilmes.value).toFixed(1)
})

// Gênero Favorito (Moda)
const generoFavorito = computed(() => {
  if (totalFilmes.value === 0) return 'Nenhum'
  
  const contagem = store.filmes.reduce((acc, filme) => {
    // Normaliza: "Ação " -> "Ação"
    let genero = filme.genero?.trim() || 'Outros'
    // Capitaliza: "ação" -> "Ação"
    genero = genero.charAt(0).toUpperCase() + genero.slice(1).toLowerCase()
    
    acc[genero] = (acc[genero] || 0) + 1
    return acc
  }, {})

  // Retorna a chave com maior valor
  return Object.keys(contagem).reduce((a, b) => contagem[a] > contagem[b] ? a : b)
})

// Melhores Filmes
const melhoresFilmes = computed(() => {
  if (totalFilmes.value === 0) return { nota: 0, filmes: [] }
  const maxNota = Math.max(...store.filmes.map(f => Number(f.nota)))
  return {
    nota: maxNota,
    filmes: store.filmes.filter(f => Number(f.nota) === maxNota)
  }
})

// Piores Filmes (Com filtro inteligente)
const pioresFilmes = computed(() => {
  if (totalFilmes.value === 0) return { nota: null, filmes: [] }
  
  // 1. Encontra a menor nota do catálogo
  const minNota = Math.min(...store.filmes.map(f => Number(f.nota)))

  // 2. REGRA DE OURO: Se a menor nota for boa (7 ou mais), não lista nada!
  if (minNota >= 7) {
    return { nota: null, filmes: [] }
  }

  // 3. Se for nota baixa (< 7), retorna os filmes
  return {
    nota: minNota,
    filmes: store.filmes.filter(f => Number(f.nota) === minNota)
  }
})

// Média por Gênero
const mediaPorGenero = computed(() => {
  const grupos = {}
  
  store.filmes.forEach(filme => {
    let genero = filme.genero?.trim() || 'Outros'
    genero = genero.charAt(0).toUpperCase() + genero.slice(1).toLowerCase()
    
    if (!grupos[genero]) grupos[genero] = { soma: 0, qtd: 0 }
    grupos[genero].soma += Number(filme.nota)
    grupos[genero].qtd++
  })

  const resultado = {}
  for (const genero in grupos) {
    resultado[genero] = grupos[genero].soma / grupos[genero].qtd
  }
  return resultado
})

// Distribuição de Notas (Faixas)
const distribuicaoNotas = computed(() => {
  const faixas = {
    'Excelentes (9-10)': { contagem: 0, cor: 'success' },
    'Muito Bons (7-8)': { contagem: 0, cor: 'teal' },
    'Regulares (5-6)': { contagem: 0, cor: 'warning' },
    'Fracos (< 5)': { contagem: 0, cor: 'error' },
  }

  store.filmes.forEach(filme => {
    const nota = Number(filme.nota)
    if (nota >= 9) faixas['Excelentes (9-10)'].contagem++
    else if (nota >= 7) faixas['Muito Bons (7-8)'].contagem++
    else if (nota >= 5) faixas['Regulares (5-6)'].contagem++
    else faixas['Fracos (< 5)'].contagem++
  })

  return Object.entries(faixas).map(([faixa, dados]) => ({ faixa, ...dados }))
})
</script>

<template>
  <v-container>
    <div class="mt-2 pb-4">
      <h1 class="text-h4 font-weight-black">Dashboard</h1>
      <p class="text-subtitle-1 text-medium-emphasis mb-0">
        Olá, <strong>{{ auth.user?.user_metadata?.full_name }}</strong>. Aqui está o resumo do nosso catálogo compartilhado.
      </p>
    </div>
    <v-divider class="mb-6"></v-divider>

    <v-row dense>
      <v-col cols="12" md="4">
        <v-card variant="tonal" color="primary" class="d-flex flex-column justify-center text-center py-4" height="100%">
          <v-icon icon="mdi-movie-open-outline" size="40" class="mb-2 mx-auto"></v-icon>
          <div class="text-h3 font-weight-black">{{ totalFilmes }}</div>
          <div class="text-body-1 font-weight-bold">Filmes Cadastrados</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="tonal" color="amber-darken-2" class="d-flex flex-column justify-center text-center py-4" height="100%">
          <v-icon icon="mdi-star-half-full" size="40" class="mb-2 mx-auto"></v-icon>
          <div class="text-h3 font-weight-black">{{ mediaGeralNotas }}</div>
          <div class="text-body-1 font-weight-bold">Média Geral</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="tonal" color="purple-accent-2" class="d-flex flex-column justify-center text-center py-4" height="100%">
          <v-icon icon="mdi-trophy-outline" size="40" class="mb-2 mx-auto"></v-icon>
          <div class="text-h4 font-weight-black mt-1 mb-1">{{ generoFavorito }}</div>
          <div class="text-body-1 font-weight-bold">Gênero Favorito</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card elevation="2" title="Distribuição das Notas">
          <v-card-text>
            <v-list density="compact">
              <v-list-item v-for="(item, index) in distribuicaoNotas" :key="index">
                <template v-slot:prepend>
                   <div style="width: 140px" class="font-weight-medium text-caption">{{ item.faixa }}</div>
                </template>
                
                <v-progress-linear 
                    :model-value="totalFilmes > 0 ? (item.contagem / totalFilmes) * 100 : 0" 
                    :color="item.cor" 
                    height="15" 
                    rounded
                    striped
                >
                    <template v-slot:default="{ value }">
                        <strong class="text-xs text-white">{{ Math.ceil(value) }}%</strong>
                    </template>
                </v-progress-linear>

                <template v-slot:append>
                    <div class="ml-4 font-weight-bold">{{ item.contagem }}</div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="grey-darken-3" class="h-100 d-flex align-center justify-center text-center" hover to="/filmes">
            <div>
                <v-icon size="64" color="green" class="mb-2">mdi-plus-circle-outline</v-icon>
                <h3 class="text-h5">Gerenciar Catálogo</h3>
                <p class="text-caption text-grey">Adicionar, editar ou excluir filmes</p>
            </div>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <v-card variant="outlined" color="success" class="h-100">
          <v-card-title class="d-flex align-center">
             <v-icon start>mdi-thumb-up</v-icon> Destaques (Nota {{ melhoresFilmes.nota }})
          </v-card-title>
          <v-card-text>
            <v-chip v-for="filme in melhoresFilmes.filmes" :key="filme.id" class="ma-1" color="success" label>
              {{ filme.titulo }}
            </v-chip>
            <span v-if="melhoresFilmes.filmes.length === 0" class="text-grey">Nenhum dado ainda.</span>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" color="error" class="h-100">
          <v-card-title class="d-flex align-center">
             <v-icon start>mdi-thumb-down</v-icon> 
             {{ pioresFilmes.nota !== null ? `Precisa Melhorar (Nota ${pioresFilmes.nota})` : 'Precisa Melhorar' }}
          </v-card-title>
          
          <v-card-text>
            <template v-if="pioresFilmes.filmes.length > 0">
                <v-chip v-for="filme in pioresFilmes.filmes" :key="filme.id" class="ma-1" color="error" label>
                {{ filme.titulo }}
                </v-chip>
            </template>

            <span v-else-if="totalFilmes === 0" class="text-grey">
                Nenhum dado ainda.
            </span>

            <div v-else class="text-green text-body-2 d-flex align-center mt-2">
                <v-icon start color="green">mdi-check-circle</v-icon> 
                Tudo ótimo! Nenhum filme com nota baixa.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>Média por Gênero</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
             <v-row>
                 <v-col v-for="(media, genero) in mediaPorGenero" :key="genero" cols="6" sm="4" md="3">
                     <div class="text-center pa-2 border rounded">
                         <div class="text-subtitle-2 text-grey">{{ genero }}</div>
                         <div class="text-h5 font-weight-bold text-primary">{{ media.toFixed(1) }}</div>
                         <v-rating :model-value="media / 2" density="compact" half-increments readonly size="x-small" color="amber"></v-rating>
                     </div>
                 </v-col>
             </v-row>
             <div v-if="Object.keys(mediaPorGenero).length === 0" class="text-center text-grey py-4">
                 Cadastre filmes com gêneros para ver as estatísticas.
             </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>
<template>
  <v-card class="h-100 d-flex flex-column" elevation="6" hover>
    <v-img 
      :src="filme.capa_url || 'https://placehold.co/300x450?text=Sem+Capa'" 
      height="250" 
      cover 
      class="align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.9)"
    >
      <v-card-title class="text-white text-subtitle-1 font-weight-bold">
        {{ filme.titulo }}
      </v-card-title>
    </v-img>

    <v-card-text class="pt-3 flex-grow-1">
      <v-chip :color="getColorForGenre(filme.genero)" size="x-small" variant="tonal" class="mb-2 font-weight-bold">
        {{ filme.genero || 'Geral' }}
      </v-chip>
      
      <div class="d-flex align-center mt-1">
        <v-rating
          :model-value="filme.nota / 2"
          color="amber"
          density="compact"
          half-increments
          readonly
          size="small"
        ></v-rating>
        <div class="text-caption text-grey ms-2">
          {{ filme.nota }} / 10
        </div>
      </div>

      <div class="mt-3 text-center">
         <v-chip size="small" :color="filme.status === 'assistido' ? 'green' : 'blue'">
            {{ filme.status }}
         </v-chip>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn 
        color="orange" 
        variant="text" 
        size="small" 
        prepend-icon="mdi-pencil"
        @click="$emit('editar', filme)"
      >
        Editar
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn 
        color="red" 
        icon="mdi-delete" 
        size="small" 
        variant="text"
        @click="$emit('excluir', filme)"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  filme: { type: Object, required: true }
});

defineEmits(['editar', 'excluir']); // Avisa o pai quando clicar

// Cores para os gêneros
const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'purple', 'pink', 'teal', 'orange'];
const getColorForGenre = (genero) => {
  if (!genero) return 'grey';
  let hash = 0;
  for (let i = 0; i < genero.length; i++) hash = genero.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash % colors.length)];
};
</script>
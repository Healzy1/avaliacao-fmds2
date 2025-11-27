<template>
  <v-dialog :model-value="dialog" @update:model-value="fechar" max-width="600px">
    <v-card>
      <v-toolbar :color="isEdicao ? 'orange-darken-3' : 'green-darken-3'" :title="formTitle"></v-toolbar>

      <v-card-text class="pt-4">
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="filmeEditado.titulo"
                  label="Título do Filme"
                  prepend-inner-icon="mdi-movie-open"
                  variant="outlined"
                  :rules="[v => !!v || 'Obrigatório']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="filmeEditado.genero"
                  label="Gênero"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="filmeEditado.ano"
                  label="Ano"
                  type="number"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="filmeEditado.nota"
                  label="Nota (0-10)"
                  type="number"
                  variant="outlined"
                  density="compact"
                  :rules="notaRules"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="filmeEditado.status"
                  label="Status"
                  :items="['Assistido', 'Quero ver', 'Dropado']"
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="filmeEditado.capa_url"
                  label="URL da Capa (Imagem)"
                  variant="outlined"
                  hint="Cole o link da imagem aqui"
                  prepend-inner-icon="mdi-image"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="fechar">Cancelar</v-btn>
        <v-btn :color="isEdicao ? 'orange' : 'green'" variant="elevated" @click="salvar">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  dialog: Boolean,
  item: Object
});

const emit = defineEmits(['update:dialog', 'salvar']);

const form = ref(null);
const filmeEditado = ref({});

const isEdicao = computed(() => !!(props.item && props.item.id));
const formTitle = computed(() => isEdicao.value ? 'Editar Filme' : 'Novo Filme');

// Regras da Nota (0 a 10)
const notaRules = [
  v => v !== '' || 'Nota é obrigatória',
  v => (v >= 0 && v <= 10) || 'A nota deve ser entre 0 e 10',
];

// Atualiza o formulário quando o item muda
watch(() => props.item, (novoItem) => {
  filmeEditado.value = { ...novoItem };
}, { immediate: true });

const salvar = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    emit('salvar', filmeEditado.value);
  }
};

const fechar = () => {
  emit('update:dialog', false);
};
</script>
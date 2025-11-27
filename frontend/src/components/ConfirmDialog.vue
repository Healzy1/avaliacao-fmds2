<template>
  <v-dialog :model-value="dialog" @update:model-value="$emit('update:dialog', $event)" max-width="400px">
    <v-card>
      <v-card-title class="text-h5 bg-red-darken-3 text-white">
        <v-icon start>mdi-alert</v-icon> {{ title }}
      </v-card-title>
      <v-card-text class="pt-4">{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="$emit('cancel')">Cancelar</v-btn>
        <v-btn color="red" variant="elevated" @click="$emit('confirm')">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  dialog: Boolean,
  title: String,
  message: String,
});
defineEmits(['update:dialog', 'confirm', 'cancel']);
</script>
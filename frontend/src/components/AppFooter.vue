<template>
  <v-footer
    app
    height="40"
  >
    <div>
      <a
        v-for="item in items"
        :key="item.href"
        class="d-inline-block mx-2 social-link"
        :href="item.href"
        rel="noopener noreferrer"
        target="_blank"
        :title="item.title"
      >
        <v-icon
          :icon="item.icon"
          size="16"
        />
      </a>
    </div>

    <v-spacer></v-spacer>

    <div class="text-caption text-disabled">
      &copy; {{ new Date().getFullYear() }} <span class="d-none d-sm-inline-block">Movie Checker</span>
    </div>
  </v-footer>
</template>

<script setup>
  const items = [
    {
      title: 'GitHub do Desenvolvedor 1',
      icon: `mdi-github`,
      href: 'https://github.com/healzy1',
    },
    {
      title: 'GitHub do Desenvolvedor 2',
      icon: `mdi-github`,
      href: 'https://github.com/Minatodesune',
    }
  ]
</script>

<style scoped>
.social-link :deep(.v-icon) {
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  text-decoration: none;
  transition: .2s ease-in-out;
}

.social-link:hover :deep(.v-icon) {
  color: rgb(var(--v-theme-primary));
}
</style>
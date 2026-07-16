<template>
  <q-page padding class="catalog-page">
    <div class="catalog-title text-center q-mb-lg">CATÁLOGO</div>

    <CatalogView />
  </q-page>
</template>

<script setup lang="ts">
import { CatalogView } from 'src/components/catalog';
import { useMeta } from 'quasar';
import { branding } from 'src/config/branding';

useMeta({
  title: `Catálogo | ${branding.name}`,
  meta: {
    description: { name: 'description', content: `Catálogo de productos ${branding.name} — alimentos, bebidas, aseo, limpieza, hogar y más.` },
    'og:title': { property: 'og:title', content: `Catálogo | ${branding.name}` },
    'og:description': { property: 'og:description', content: `Catálogo de productos ${branding.name}` },
    'og:url': { property: 'og:url', content: '/catalogo' },
    'twitter:title': { name: 'twitter:title', content: `Catálogo | ${branding.name}` },
    'twitter:description': { name: 'twitter:description', content: `Catálogo de productos ${branding.name}` },
  },
});
</script>

<style scoped>
.catalog-page {
  background: #F5EDE0;
}

.catalog-title {
  font-family: 'Lexend', serif;
  font-size: 1.75rem;
  letter-spacing: 3px;
  color: #1C1C1C;
}
</style>

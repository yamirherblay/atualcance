<template>
  <q-page padding class="catalog-page">
    <ProductFilters
      :categories="categories"
      :selected-category="selectedCategory"
      @select="handleCategorySelect"
    />

    <ViewToggle
      :search="filterQuery"
      :view-mode="viewMode"
      @update:search="handleSearchUpdate"
      @update:view-mode="handleViewModeUpdate"
    />

    <ProductGrid
      :products="displayedProducts"
      :view-mode="viewMode"
      @whatsapp="handleWhatsApp"
      @add-to-cart="handleAddToCart"
    >
      <template #empty>
        <div v-if="filterQuery">No se encontraron productos para "{{ filterQuery }}"</div>
        <div v-else>No hay productos disponibles en esta categoría.</div>
      </template>
    </ProductGrid>

    <div ref="sentinelRef" class="sentinel" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductFilters from './ProductFilters.vue';
import ViewToggle from './ViewToggle.vue';
import ProductGrid from './ProductGrid.vue';
import type { ViewMode } from './types';
import { useProducts } from 'src/composables/useProducts';
import { useWhatsApp } from 'src/composables/useWhatsApp';
import { useGlobalSearch } from 'src/composables/useGlobalSearch';
import { useCartStore } from 'src/stores/cart';
import type { Product } from 'src/stores/types';
import { useQuasar } from 'quasar';

const LS_KEY = 'shalom_catalog_view';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { products, fetchProducts, getCategories } = useProducts();
const { sendProductRequest } = useWhatsApp();
const cartStore = useCartStore();

const selectedCategory = ref('all');
const { searchQuery } = useGlobalSearch();

const viewMode = ref<ViewMode>('small_grid');

const PAGE_SIZE = 15;
const visibleCount = ref(PAGE_SIZE);
const sentinelRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const filterQuery = computed(() => {
  return searchQuery.value || (route.query.q as string) || '';
});

const categories = computed(() => {
  const cats = getCategories();
  return [{ key: 'all', label: 'Todos'},{key:'offer' , label:'Oferta'}, ...cats.map((c) => ({ key: c, label: capitalize(c) }))];
});

const filteredProducts = computed(() => {
  let filtered = products.value.filter((p) => p.estado !== 'Agotado');

  if (selectedCategory.value !== 'all' && selectedCategory.value !== 'offer') {
    filtered = filtered.filter((p) => p.category === selectedCategory.value);
  }
  if(selectedCategory.value == 'offer')
  {
    filtered = filtered.filter((p) => p.oferta === true);
  }

  if (filterQuery.value.trim()) {
    const query = filterQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.descripcion?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query),
    );
  }

  return filtered;
});

const displayedProducts = computed(() =>
  filteredProducts.value.slice(0, visibleCount.value),
);

const hasMore = computed(() =>
  filteredProducts.value.length > displayedProducts.value.length,
);

watch([selectedCategory, filterQuery], () => {
  visibleCount.value = PAGE_SIZE;
});

function handleSearchUpdate(value: string) {
  searchQuery.value = value;
}

function handleViewModeUpdate(value: ViewMode) {
  viewMode.value = value;
  localStorage.setItem(LS_KEY, value);
}

function handleCategorySelect(key: string) {
  selectedCategory.value = key;
  void router.replace({
    query: key !== 'all' ? { cat: key } : {},
  });
}

function handleWhatsApp(product: Product) {
  sendProductRequest(product);
}

function handleAddToCart(product: Product) {
  cartStore.add(product);
  $q.notify({
    type: 'info',
    message: `Agregado al carrito: ${product.name}`,
    timeout: 2000,
  });
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

onMounted(async () => {
  const saved = localStorage.getItem(LS_KEY);
  if (saved && ['small_grid', 'large_grid', 'list'].includes(saved)) {
    viewMode.value = saved as ViewMode;
  }

  await fetchProducts();
  if (route.query.cat && typeof route.query.cat === 'string') {
    selectedCategory.value = route.query.cat;
  }
  await nextTick();
  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && hasMore.value) {
      visibleCount.value += PAGE_SIZE;
    }
  }, { rootMargin: '400px' });
  if (sentinelRef.value) {
    observer.observe(sentinelRef.value);
  }
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
.catalog-page {
  background: #F5EDE0;
}

.sentinel {
  height: 1px;
}
</style>

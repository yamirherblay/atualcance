<template>
  <q-card class="product-large-item" flat bordered>
    <div class="vermillion-border-top"></div>
    <div class="large-hero">
      <q-img
        :src="product.image || '/images/placeholder.svg'"
        :alt="product.name"
        :img-style="{ objectFit: 'cover', height: '100%' }"
        class="cursor-pointer"
        @click="preview.open(product)"
      >
        <div v-if="product.oferta && product.estado !== 'Agotado'" class="absolute-top-right q-pa-sm">
          <q-badge color="accent" text-color="dark" label="Oferta" class="badge-oferta" />
        </div>
        <div v-if="product.new" class="absolute-top-left q-pa-sm">
          <q-badge color="dark" text-color="white" label="Nuevo" class="badge-new" />
        </div>
      </q-img>
    </div>

    <q-card-section class="q-pa-md card-info">
      <div class="large-title" @click="preview.open(product)">{{ product.name }}</div>
      <div v-if="product.descripcion" class="large-desc text-grey-7 ellipsis-3-lines">
        {{ product.descripcion }}
      </div>
      <div class="row items-center justify-between q-mt-sm">
        <div class="large-price" :class="{ 'price-stacked': product.oferta }">
          <template v-if="product.oferta">
            <span class="old-price">{{ formatPrice(product.price, product.currency) }}</span>
            <span class="sale-price">{{ formatPrice(product.descuento, product.currency) }}</span>
          </template>
          <template v-else>
            <span class="sale-price">{{ formatPrice(product.price, product.currency) }}</span>
          </template>
        </div>
        <q-badge
          :color="product.estado === 'Disponible' ? 'positive' : 'negative'"
          :label="product.estado"
          class="large-status"
        />
      </div>
    </q-card-section>

    <q-card-actions class="q-pa-md row items-center justify-end q-gutter-sm">
      <q-btn
        flat
        round
        icon="fa-brands fa-whatsapp"
        size="md"
        color="green-6"
        @click="$emit('whatsapp', product)"
      />
      <q-btn
        outline
        class="large-add"
        no-caps
        icon="shopping_cart"
        label="Añadir"
        :disable="product.estado === 'Agotado'"
        @click="$emit('add-to-cart', product)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import type { Product } from 'src/stores/types';
import { useProductPreview } from 'src/composables/useProductPreview';
import { formatPrice } from 'src/utils/format';

const preview = useProductPreview();

defineProps<{
  product: Product;
}>();

defineEmits<{
  (e: 'whatsapp', product: Product): void;
  (e: 'add-to-cart', product: Product): void;
}>();
</script>

<style scoped>
.product-large-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.2s ease;
}

.product-large-item:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.large-hero {
  width: 100%;
  height: 260px;
  max-height: 260px;
  overflow: hidden;
  position: relative;
  background: #f0eae0;
}

.card-info {
  flex: 1 1 auto;
}

.large-title {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #1C1C1C;
  line-height: 1.2;
  cursor: pointer;
}

.large-title:hover {
  text-decoration: underline;
}

.large-desc {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.85rem;
  line-height: 1.35;
  margin-top: 4px;
}

.large-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 400;
  color: #1C1C1C;
}

.large-status {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 2px;
}

.large-add {
  border-color: #C84B31;
  color: #C84B31;
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 6px 16px;
}

.price-stacked {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  gap: 2px;
}

.old-price {
  text-decoration: line-through;
  opacity: 0.45;
  color: #dc2626;
  margin-right: 6px;
  font-size: 0.85em;
}

.sale-price {
  font-weight: 600;
  color: #1C1C1C;
}

.badge-oferta,
.badge-new {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 2px;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
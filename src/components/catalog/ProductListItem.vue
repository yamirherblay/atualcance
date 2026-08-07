<template>
  <q-card class="product-list-item" flat bordered>
    <div class="row no-wrap items-stretch">
      <div class="list-image-col">
        <q-img
          :src="product.image || '/images/placeholder.svg'"
          :ratio="1"
          :alt="product.name"
          class="list-image cursor-pointer"
          @click="preview.open(product)"
        >
          <div v-if="product.oferta && product.estado !== 'Agotado'" class="absolute-top-right q-pa-xs">
            <q-badge color="accent" text-color="dark" label="Oferta" class="badge-oferta" />
          </div>
          <div v-if="product.new" class="absolute-top-left q-pa-xs">
            <q-badge color="dark" text-color="white" label="Nuevo" class="badge-new" />
          </div>
        </q-img>
      </div>
      <div class="list-info-col col column justify-between q-pa-sm">
        <div>
          <div class="list-title" @click="preview.open(product)">{{ product.name }}</div>
          <div v-if="product.descripcion" class="list-desc text-grey-7 ellipsis-3-lines">{{ product.descripcion }}</div>
        </div>
        <div class="row items-center justify-between q-mt-xs">
          <div class="list-price" :class="{ 'price-stacked': product.oferta }">
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
            class="list-status"
          />
        </div>
        <div class="row items-center justify-end q-gutter-xs q-mt-xs">
          <q-btn
            flat
            round
            dense
            icon="fa-brands fa-whatsapp"
            size="sm"
            color="green-6"
            @click="$emit('whatsapp', product)"
          />
          <q-btn
            flat
            round
            dense
            icon="shopping_cart"
            size="sm"
            color="primary"
            :disable="product.estado === 'Agotado'"
            @click="$emit('add-to-cart', product)"
          />
        </div>
      </div>
    </div>
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
.product-list-item {
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.product-list-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.list-image-col {
  width: 110px;
  min-width: 110px;
  overflow: hidden;
}

@media (min-width: 600px) {
  .list-image-col {
    width: 140px;
    min-width: 140px;
  }
}

.list-image {
  height: 100%;
}

.list-info-col {
  min-width: 0;
}

.list-title {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #1C1C1C;
  line-height: 1.2;
  cursor: pointer;
}

.list-title:hover {
  text-decoration: underline;
}

.list-desc {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.8rem;
  line-height: 1.3;
  margin-top: 2px;
}

.list-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  font-weight: 400;
  color: #1C1C1C;
}

.list-status {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 2px;
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

.badge-oferta {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 2px;
}

.badge-new {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.65rem;
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

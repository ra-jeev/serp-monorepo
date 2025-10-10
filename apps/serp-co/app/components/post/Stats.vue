<script setup lang="ts">
interface Props {
  total: number;
  singular: string;
  plural: string;
  variant?: 'default' | 'center';
}

const { total, singular, plural, variant = 'center' } = defineProps<Props>();
</script>

<template>
  <div v-if="total > 0" :class="{ 'text-center mb-8': variant === 'center' }">
    <UBadge color="neutral" variant="subtle" size="lg">
      {{ total.toLocaleString() }}
      {{ total === 1 ? singular : plural }}
    </UBadge>
  </div>
</template>

<template>
  <div class="p-4">
    <h1 class="text-2xl mb-4">
      Hello World!
    </h1>
    <UButton @click="onClick">
      Click me!
    </UButton>
  </div>
</template>

<script setup lang="ts">
const onClick = () => {
  alert('Hi there!');
};
</script>

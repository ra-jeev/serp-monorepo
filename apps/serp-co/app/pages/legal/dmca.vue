<template>
  <UContainer>
    <UPage>
      <UPageBody class="prose prose-zinc dark:prose-invert max-w-none">
        <h1>
          DMCA Policy
        </h1>
        <p>
          We take intellectual property very seriously. If you would like to
          file a complaint regarding the DMCA or other intellectual property
          matters, please email: dmca[@]{{ siteUrl }} and/or ipcomplaints[@]{{ siteUrl }}
          Please make sure you remove the brackets [ ] and spaces in the above
          provided emails. We format it like this to reduce spam from bots,
          spiders, and scrapers. Thank you.
        </p>
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
const siteUrl = useAppConfig().site.url;
</script>

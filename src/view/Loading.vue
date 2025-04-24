<script setup>
const props = defineProps({
  progress: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <v-container
      class="d-flex flex-column align-center justify-center fill-height text-center"
      fluid
  >
    <!-- ლოგო -->
    <v-img
        src="/src/assets/logo.svg"
        max-height="120"
        max-width="120"
        class="mb-5"
        contain
    />

    <!-- წრიული პროგრესი -->
    <v-progress-circular
        :model-value="progress"
        :size="100"
        :width="10"
        color="primary"
    >
      {{ progress }}%
    </v-progress-circular>

    <!-- ტექსტი -->
    <div class="mt-4 text-subtitle-1 text-medium-emphasis">
      მონაცემების ჩატვირთვა...
    </div>
  </v-container>
</template>

<style scoped>
</style>

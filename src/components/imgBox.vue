

<script setup>
import { ref, inject, watch, toRef } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const fileInput = ref(null)
const images = ref([])
watch(() => props.images, (newImages) => {
  images.value = newImages.map(img => ({
    ...img,
    file: null, // server side-ს არ ექნება file
    url: img.url,
    isMain: !!img.isMain
  }))
}, { immediate: true })

const $http = inject('$http');

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFiles = (e) => {
  const files = Array.from(e.target.files)
  previewAndUpload(files)
  fileInput.value.value = ''
}

const handleDrop = (e) => {
  const files = Array.from(e.dataTransfer.files)
  previewAndUpload(files)
}

const previewAndUpload = (files) => {
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const size = 300
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')

        const minSide = Math.min(img.width, img.height)
        const sx = (img.width - minSide) / 2
        const sy = (img.height - minSide) / 2

        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size)

        canvas.toBlob(async (blob) => {
          const url = URL.createObjectURL(blob)
          const image = {
            file: blob,
            url,
            isMain: images.value.length === 0
          }

          images.value.push(image)
          await uploadImage(blob)
        }, file.type)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

const uploadImage = async (blob) => {
  const formData = new FormData()
  formData.append('ProductId', props.id) // შეცვალე საჭიროებისამებრ
  formData.append('File', blob, 'image.png')

  try {
    const res = await $http.post('Products/UploadImage', formData, true)
    console.log('✔️ ატვირთულია', res)
  } catch (err) {
    console.error('❌ ატვირთვის შეცდომა', err)
  }
}

const removeImage = (id) => {
  $http.post('Products/DeleteImage', {id:id}, true)
}

const setMainImage = (index) => {
  images.value.forEach((img, i) => {
    img.isMain = i === index
  })
}
</script>
<template>
  <v-container>
    <v-row class="d-flex flex-wrap" no-gutters>
      <!-- Upload Box -->
      <v-col cols="auto" class="pa-2">
        <v-card
            width="100"
            height="100"
            outlined
            rounded="xl"
            class="d-flex align-center justify-center flex-column"
            @drop.prevent="handleDrop"
            @dragover.prevent
            style="border: 2px dashed #ccc; cursor: pointer;"
            @click="triggerFileInput"
        >
          <v-icon size="30">mdi-camera-plus</v-icon>
          <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              class="d-none"
              @change="handleFiles"
          />
        </v-card>
      </v-col>

      <!-- Uploaded Images -->
      <v-col
          v-for="(image, index) in images"
          :key="index"
          cols="auto"
          class="pa-2"
      >
        <v-card
            width="100"
            height="100"
            outlined
            rounded="xl"
            class="position-relative"
            :class="{ 'border-primary': image.isMain }"
        >
          <v-img
              :src="'http://app.bitwise.ge/'+image.path"
              width="100"
              height="100"
              cover
              class="rounded-xl"
          ></v-img>

          <!-- Delete Button -->
          <v-btn
              icon
              class="position-absolute top-0 right-0 mt-1 mr-1"
              size="x-small"
              @click="removeImage(image.id)"
              color="red"
          >
            <v-icon size="14">mdi-close</v-icon>
          </v-btn>

          <!-- Main Toggle Button -->
          <v-btn
              icon
              class="position-absolute top-0 left-0 mt-1 ml-1"
              size="x-small"
              @click="setMainImage(index)"
              :color="image.isMain ? 'primary' : 'grey lighten-1'"
          >
            <v-icon size="14">mdi-star</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.d-none {
  display: none;
}
.border-primary {
  border: 2px solid #1976D2;
}
</style>

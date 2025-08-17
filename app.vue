<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

      <!-- Global Snackbar -->
    <v-snackbar
      v-model="snackbarState.show"
      :color="snackbarState.color"
      :timeout="snackbarState.timeout"
      location="top right"
    >
      {{ snackbarState.text }}
      
      <template #actions>
        <v-btn
          color="white"
          variant="text"
          @click="hideSnackbar"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script setup lang="ts">
  const { snackbarState, hideSnackbar } = useSnackbar()
</script>
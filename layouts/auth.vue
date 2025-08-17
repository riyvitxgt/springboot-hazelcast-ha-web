<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-row justify="center" align="center" no-gutters>
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup></script>
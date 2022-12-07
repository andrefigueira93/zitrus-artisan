<template>
  <v-footer padless class="mt-5 transparent">
    <v-card
      flat
      tile
      class="d-flex flex-column flex-sm-row text-center justify-center mb-5 transparent"
      style="width: 100%"
    >
      <v-img
        src="/logo.png"
        width="80px"
        height="80px"
        alt="Zitrus Artisan Logo"
        class="rounded-circle align-self-center"
      />
      <v-card-text>
        <v-btn v-for="icon in icons" :key="icon" class="mx-4" icon>
          <v-icon color="grey" size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-text>
      <p class="flex-shrink-0">
        {{ new Date().getFullYear() }} —
        <strong>Z|Artisan | Zitrus Tech</strong>
      </p>
    </v-card>
  </v-footer>
</template>
<script>
export default {
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
  }),
};
</script>

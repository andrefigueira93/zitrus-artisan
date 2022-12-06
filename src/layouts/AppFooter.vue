<template>
  <v-footer padless class="mt-5 transparent">
    <v-card flat tile class="d-flex transparent" style="width: 100%">
      <v-img
        src="/logo.png"
        width="80px"
        height="80px"
        alt="Zitrus Artisan Logo"
        class="rounded-circle"
      />
      <v-card-text>
        <v-btn v-for="icon in icons" :key="icon" class="mx-4" icon>
          <v-icon color="grey" size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
        {{ new Date().getFullYear() }} —
        <strong>Z|Artisan | Zitrus Tech</strong>
      </v-card-text>
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

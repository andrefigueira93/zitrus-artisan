<template>
  <div>
    <v-snackbar
      v-for="snack in snacks"
      v-model="snack.show"
      :key="snack.id"
      :timeout="snack.timeout"
      :color="snack.color"
      placement="top"
      appear
    >
      <v-icon>{{ snack.icon }}</v-icon>
      {{ snack.message }}
      <v-btn text @click="snack.show = false">Fechar</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "GlobalSnackbar",
  computed: {
    snacks() {
      return this.$store.getters["snacks/getSnacks"];
    },
  },
};
</script>

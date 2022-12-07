<template>
  <v-app>
    <v-main class="grey lighten-5">
      <component v-bind:is="layout" />
      <global-snackbar />
    </v-main>
  </v-app>
</template>

<script>
import AppLayout from "./layouts/AppLayout.vue";
import GuestLayout from "./layouts/GuestLayout.vue";
import GlobalSnackbar from "./components/general/GlobalSnackbar.vue";
import { mapState } from "vuex";

export default {
  name: "App",
  computed: {
    layout() {
      return this.$store.getters["layout/mode"];
    },
    ...mapState("snacks", ["records"]),
  },
  components: {
    "app-layout": AppLayout,
    "simple-layout": GuestLayout,
    GlobalSnackbar,
  },
};
</script>

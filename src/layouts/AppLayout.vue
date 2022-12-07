<template>
  <v-card
    class="transparent px-sm-8"
    style="overflow: scroll; height: 100vh"
    flat
  >
    <v-app-bar
      flat
      color="transparent"
      style="position: sticky; top: 0px; z-index: 2"
    >
      <v-app-bar-nav-icon
        class="glass mr-auto"
        @click="toggleDrawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app class="glass rounded-lg">
      <app-sidebar-content />
    </v-navigation-drawer>
    <v-col class="pa-0">
      <v-container fluid class="pa-0 glass rounded-lg overflow-hidden">
        <v-card flat class="pa-8">
          <v-scroll-x-transition mode="out-in">
            <router-view v-slot="{ Component, route }">
              <!-- Use any custom transition and  to `fade` -->
              <component :is="Component" :key="route.fullPath" />
            </router-view>
          </v-scroll-x-transition>
        </v-card>
      </v-container>
      <app-footer />
    </v-col>
  </v-card>
</template>

<script>
import AppSidebarContent from "@/components/contents/app/AppSidebarContent.vue";
import AppFooter from "./AppFooter.vue";

export default {
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/signOut");
      this.$router.push("/");
    },
    showSnack(payload) {
      this.$store.dispatch("snacks/addSnack", payload);
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
  components: {
    AppSidebarContent,
    AppFooter,
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },
};
</script>

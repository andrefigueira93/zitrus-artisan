<template>
  <v-main class="pa-4 pa-sm-12 grey lighten-5">
    <v-card class="d-flex transparent flex-column flex-sm-row pa-sm-8" flat>
      <v-navigation-drawer
        :model="drawer"
        class="glass rounded-lg mr-sm-5"
        style="position: sticky; top: 10px"
      >
        <app-sidebar-content />
      </v-navigation-drawer>
      <v-col class="col-9 pa-0">
        <v-container fluid class="pa-0 glass rounded-lg overflow-hidden">
          <v-card flat class="pa-8">
            <router-view v-slot="{ Component, route }">
              <!-- Use any custom transition and  to `fade` -->
              <transition :name="route.meta.transitionName || 'fade'">
                <component :is="Component" :key="route.fullPath" />
              </transition>
            </router-view>
          </v-card>
        </v-container>
        <app-footer />
      </v-col>
    </v-card>
  </v-main>
</template>

<script>
import AppSidebarContent from "@/components/contents/app/AppSidebarContent.vue";
import AppFooter from "./AppFooter.vue";

export default {
  data() {
    return {
      drawer: true,
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

<template>
  <div>
    <v-list nav dense>
      <v-list-item class="px-2">
        <v-list-item-avatar size="120" class="mx-auto">
          <zitrus-logo />
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <user-avatar-dropdown />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list nav dense>
      <v-list-item
        color="green darken-2"
        v-for="i in items"
        :key="i.route"
        :to="i.route"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ i.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ i.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import ZitrusLogo from "@/components/general/ZitrusLogo.vue";
import UserAvatarDropdown from "@/components/general/UserAvatarDropdown.vue";
export default {
  data() {
    return {};
  },
  computed: {
    items() {
      return [
        { icon: "mdi-home", title: "Início", route: "/app/inicio" },
        {
          icon: "mdi-account-group",
          title: "Clientes",
          route: "/app/clientes",
        },
        {
          icon: "mdi-monitor-dashboard",
          title: "Produtos",
          route: "/app/produtos",
        },
        {
          icon: "mdi-truck-delivery",
          title: "Entregas",
          route: "/app/entregas",
        },
      ];
    },
  },
  components: {
    ZitrusLogo,
    UserAvatarDropdown,
  },
};
</script>

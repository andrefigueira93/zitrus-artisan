<template>
  <v-menu transition="slide-x-transition" bottom right>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="secondary lighten-1" block dark v-bind="attrs" v-on="on">
        {{ user?.username }}
      </v-btn>
    </template>

    <v-list>
      <v-list-item link to="/app/meu-perfil">
        <v-list-item-title>Meu Perfil</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-title> Sair </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "UserAvatarDropdown",
  data() {
    return {
      items: [{ icon: "mdi-logout", title: "Sair", route: "/" }],
    };
  },
  methods: {
    async logout() {
      await this.$store.dispatch("auth/signOut");
      this.$router.push("/");
    },
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },
};
</script>

<template>
  <v-row style="height: 100%" class="m-0">
    <v-col
      class="col-12 col-sm-9 align-self-center text-center"
      style="padding: 0"
    >
      <v-img
        src="/logo.png"
        width="400px"
        height="400px"
        alt="Zitrus Artisan Logo"
        class="mx-auto rounded-circle elevation-1"
      />
    </v-col>
    <v-col class="col-12 col-sm-3 m-0" style="padding: 0">
      <v-card
        elevation="8"
        class="text-center pa-8 pa-sm-12"
        style="height: 100%"
      >
        <v-card-text>
          <div class="mx-auto" style="max-width: 5rem">
            <zitrus-logo />
          </div>
          <h1><strong>Z</strong> | Artisan</h1>
          <v-expand-transition>
            <v-col v-if="newUser">
              <sign-up-card />
            </v-col>
            <v-col v-else>
              <sign-in-card />
            </v-col>
          </v-expand-transition>
        </v-card-text>
        <v-card-actions class="place-content-center d-flex flex-column">
          <p v-if="newUser">Já possui uma conta?</p>
          <p v-else>Ainda não tem uma conta?</p>
          <v-btn @click="toggleNewUser" color="secondary">
            {{ newUser ? "Acesse" : "Cadastre-se" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SignInCard from "../auth/SignInCard.vue";
import SignUpCard from "../auth/SignUpCard.vue";
import ZitrusLogo from "@/components/general/ZitrusLogo.vue";
export default {
  name: "HomeViewContent",
  components: {
    SignInCard,
    SignUpCard,
    ZitrusLogo,
  },
  data: () => ({
    newUser: false,
  }),
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    toggleNewUser() {
      this.newUser = !this.newUser;
    },
  },
};
</script>

<template>
  <v-card rounded="lg" class="mx-auto py-8" :loading="loading" flat>
    <template slot="progress">
      <v-progress-linear color="success" indeterminate height="3" />
    </template>
    <v-card-title class="justify-center">
      <h3>Acesse sua Conta</h3>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="signIn">
        <v-text-field
          v-model="form.username"
          :disabled="loading"
          placeholder="Nome de Usuário"
          required
          filled
          rounded
        />
        <v-text-field
          v-model="form.password"
          :disabled="loading"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Senha"
          required
          filled
          rounded
        >
          <v-btn
            slot="append"
            :disabled="loading"
            icon
            @click="showPassword = !showPassword"
          >
            <v-icon> {{ showPassword ? "mdi-eye" : "mdi-eye-off" }} </v-icon>
          </v-btn>
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions class="place-content-center d-flex flex-column">
      <v-spacer />
      <v-btn
        :loading="loading"
        color="success"
        @click="signIn"
        x-large
        depressed
      >
        Entrar
        <v-icon right> mdi-login </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "SignInCard",
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({
    loading: false,
    showPassword: false,
    form: {
      username: "",
      password: "",
    },
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
    },
    async signIn() {
      this.v$.$touch();

      if (this.v$.$invalid) {
        return;
      } else {
        this.setLoading(true);

        try {
          await this.$store.dispatch("auth/signIn", this.form);
          this.$router.push({ name: "app-home" });
        } catch (error) {
          console.log(error);
          this.$store.dispatch("snacks/addSnack", {
            text: "Usuário ou senha inválidos",
            color: "error",
          });
        } finally {
          this.setLoading(false);
        }
      }

      this.setLoading(false);
    },
  },
  validations: {
    form: {
      password: {
        required,
        minLength: minLength(6),
      },
      username: {
        required,
        minLength: minLength(3),
      },
    },
  },
};
</script>

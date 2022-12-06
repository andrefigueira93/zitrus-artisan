<template>
  <v-card rounded="lg" class="mx-auto py-8" :loading="loading" flat>
    <template slot="progress">
      <v-progress-linear color="success" indeterminate height="3" />
    </template>
    <v-card-title class="justify-center">
      <h3>Crie sua Conta</h3>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="signUp">
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
        <v-text-field
          v-model="form.confirmPassword"
          :disabled="loading"
          :type="showPassword ? 'text' : 'password'"
          :messages="confirmPasswordMessages"
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
    <v-card-actions class="px-5">
      <v-btn
        :loading="loading"
        color="success"
        @click="signUp"
        x-large
        depressed
        block
      >
        Criar minha conta
        <v-icon right> mdi-login </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { required, minLength, sameAs } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "SignUpCard",
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({
    loading: false,
    showPassword: false,
    form: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  }),
  methods: {
    setLoading(value) {
      this.loading = value;
    },
    async signUp() {
      this.v$.$touch();

      if (this.v$.$invalid) {
        return;
      } else {
        this.setLoading(true);

        try {
          await this.$store.dispatch("auth/register", this.form);
        } catch (error) {
          console.log(error);
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
      confirmPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
      username: {
        required,
        minLength: minLength(3),
      },
    },
  },
  computed: {
    confirmPasswordMessages() {
      const messages = [];

      if (!this.v$.form.$error) {
        return messages;
      }

      if (!this.v$.form.confirmPassword.required) {
        messages.push("Campo obrigatório");
      }

      if (!this.v$.form.confirmPassword.sameAsPassword) {
        messages.push("Senhas não conferem");
      }

      return messages;
    },
  },
};
</script>

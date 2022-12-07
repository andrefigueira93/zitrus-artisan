<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card flat color="transparent">
    <v-card-title class="d-flex justify-space-between">
      <v-col cols="12" md="2">
        <h1>Clientes</h1>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          hide-details
          color="green"
          class="mr-4"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn color="success w-full" dark @click="toggleModal">
          <v-icon left>mdi-plus</v-icon>
          Novo Cliente
        </v-btn>
      </v-col>
    </v-card-title>
    <v-dialog v-model="newClientModal" persistent max-width="600px">
      <v-card :loading="loading">
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <template slot="progress">
          <v-progress-linear color="success" indeterminate height="3" />
        </template>
        <v-card-text>
          <v-form :model="editingClient" @submit.prevent="createUser">
            <v-row>
              <v-col cols="12">
                <v-img
                  :src="editingClient.avatar"
                  max-width="120"
                  class="rounded-circle mx-auto elevation-3"
                  alt="Avatar"
                />
              </v-col>
              <v-col cols="12">
                <v-file-input
                  :rules="[
                    (value) =>
                      !value ||
                      value.size < 2000000 ||
                      'Imagem muito pesada! Por favor, escolha uma imagem até 2MB.',
                  ]"
                  show-size
                  v-model="tempAvatar"
                  accept="image/png, image/jpeg, image/bmp"
                  color="green"
                  hint="Tamanho máximo 2MB"
                  placeholder="Selecione seu avatar"
                  prepend-icon="mdi-camera"
                  label="Avatar"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :disabled="loading"
                  :error-messages="formErrors['name']"
                  label="Nome Completo"
                  v-model="editingClient.name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  :disabled="loading"
                  :error-messages="formErrors['email']"
                  label="E-mail"
                  v-model="editingClient.email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  :disabled="loading"
                  label="Telefone"
                  v-model="editingClient.phone"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :loading="loadingCEP || loading"
                  :disabled="loading"
                  :error-messages="formErrors['zipCode']"
                  label="CEP"
                  required
                  @input="getAddress"
                  v-model="editingClient.address.zipCode"
                ></v-text-field>
              </v-col>
              <v-col cols="9">
                <v-text-field
                  :loading="loadingCEP || loading"
                  :disabled="loading || cepFound"
                  :error-messages="formErrors['street']"
                  v-model="editingClient.address.street"
                  label="Logradouro"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :loading="loadingCEP"
                  v-model="editingClient.address.number"
                  :disabled="loading"
                  label="Número"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :loading="loadingCEP || loading"
                  :disabled="loading || cepFound"
                  :error-messages="formErrors['neighborhood']"
                  v-model="editingClient.address.neighborhood"
                  label="Bairro"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :loading="loadingCEP || loading"
                  :disabled="loading || cepFound"
                  :error-messages="formErrors['city']"
                  v-model="editingClient.address.city"
                  label="Cidade"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :loading="loadingCEP || loading"
                  :disabled="loading || cepFound"
                  :error-messages="formErrors['state']"
                  v-model="editingClient.address.state"
                  label="Estado"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="loading"
            color="grey darken-1"
            text
            @click="toggleModal"
          >
            Fechar
          </v-btn>
          <v-btn
            :loading="loading"
            color="green darken-2"
            dark
            @click="createUser()"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="clients"
        :items-per-page="5"
        :loading="loading"
        :search="search"
        v-model="selectedClients"
        checkbox-color="green"
        item-key="id"
        sort-by="id"
        show-select
        color="green"
      >
        <template slot="progress">
          <v-progress-linear color="success" indeterminate />
        </template>
        <template v-slot:top>
          <v-btn
            color="error"
            @click="bulkDelete"
            v-if="selectedClients.length > 0"
          >
            <v-icon left>mdi-delete</v-icon>
            Excluir Selecionados
          </v-btn>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title v-if="selectedClients.length > 0">
                Tem certeza que deseja remover este(s)
                {{ selectedClients.length }} cliente(s)?
              </v-card-title>
              <v-card-title v-else>
                Tem certeza que deseja remover
                {{ editingClient?.name }}?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  v-if="selectedClients.length > 0"
                  text
                  @click="bulkDeleteItems"
                  >Confirmar</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  v-else
                  text
                  @click="deleteItemConfirm"
                  >Confirmar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center pa-2">
            <v-img
              :src="item.avatar"
              max-width="50"
              class="rounded-lg mr-2"
              alt=""
            />
            <h4>{{ item.name }}</h4>
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu offset-x left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" depressed color="transparent">
                <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="rounded-lg">
              <v-list-item>
                <v-btn depressed color="transparent" @click="editItem(item)">
                  <v-icon small class="mr-3"> mdi-pencil </v-icon>
                  Editar
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn
                  depressed
                  color="transparent"
                  open-on-hover
                  @click="deleteItem(item)"
                >
                  <v-icon small class="mr-3"> mdi-delete </v-icon>
                  Excluir
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { ClienteService } from "@/services/ClienteService";
import { required, minLength, email } from "@vuelidate/validators";
import { defaultClient } from "@/models/Client";
import { getValidationErrors } from "@/utils/getValidationErrors";
import { getCEP } from "@/services/OpenCEPService";

export default {
  name: "ClientesListViewContent",
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({
    loading: false,
    loadingCEP: false,
    newClientModal: false,
    dialogDelete: false,
    selectedClients: [],
    cepFound: false,
    search: "",
    editingClient: defaultClient,
    formErrors: [],
    clients: [],
    tempAvatar: undefined,
    headers: [
      {
        text: "#",
        sortable: true,
        value: "id",
      },
      {
        text: "Cliente",
        sortable: true,
        value: "name",
      },
      { text: "Email", value: "email", sortable: false },
      { text: "Telefone", value: "phone", sortable: false },
      { text: "Cidade", value: "address.city", sortable: true },
      { text: "UF", value: "address.state", sortable: true },
      { text: "", value: "actions", sortable: false },
    ],
  }),
  validations: {
    editingClient: {
      name: {
        required,
        minLength: minLength(3),
      },
      email: {
        required,
        email,
        minLength: minLength(3),
      },
      address: {
        zipCode: {
          required,
          minLength: minLength(8),
        },
        street: {
          required,
          minLength: minLength(3),
        },
        neighborhood: {
          required,
          minLength: minLength(3),
        },
        city: {
          required,
          minLength: minLength(3),
        },
        state: {
          required,
          minLength: minLength(2),
        },
      },
    },
  },
  watch: {
    "editingClient.address.zipCode"(newZipCode, oldClient) {
      if (newZipCode !== oldClient) {
        this.editingClient.address.zipCode = newZipCode.replace(
          /(\d{5})(\d)/,
          "$1-$2"
        );
      }
    },
    tempAvatar() {
      if (this.tempAvatar) {
        const blobFile = new Blob([this.tempAvatar], { type: "image/jpeg" });
        const fileUrl = URL.createObjectURL(blobFile);
        this.editingClient.avatar = fileUrl;
      }
    },
  },
  methods: {
    async fetchClients() {
      this.loading = true;

      const {
        data: { clientes },
      } = await ClienteService.getClientes();

      this.clients = clientes;

      this.loading = false;
    },
    async deleteItemConfirm() {
      if (this.editingClient?.id) {
        await ClienteService.deleteCliente(this.editingClient.id);
        this.fetchClients();
      }
      this.closeDelete();
    },
    async bulkDeleteItems() {
      if (this.selectedClients.length) {
        await ClienteService.bulkDeleteClientes(this.selectedClients);
        this.fetchClients();
        this.closeDelete();
        this.selectedClients = [];
      }
    },
    async createUser() {
      this.v$.$touch();

      if (this.v$.$invalid) {
        this.setErrors(this.v$.$errors);
      } else {
        this.loading = true;
        try {
          const createUser = await ClienteService.createCliente(
            this.editingClient
          );

          // Caso haja algum erro, tratar no catch
          if (createUser.error) {
            throw createUser.error;
          }

          // Setamos o fomulário para o estado inicial
          this.editingClient = defaultClient;

          // Chamamos a atualização dos clientes
          this.fetchClients();

          // Fechamos o Modal
          this.toggleModal();
        } catch (error) {
          // Caso não seja possível cadastrar o cliente, informamos
          this.$store.dispatch("snacks/addSnack", {
            color: "error",
            text: "Não foi possível cadastrar o cliente",
          });
        }
        this.loading = false;
      }
    },
    async getAddress() {
      if (this.editingClient.address.zipCode.length !== 9) {
        return;
      }
      this.cepFound = false;
      this.loadingCEP = true;

      const abortController = new AbortController();

      try {
        const response = await getCEP(
          this.editingClient.address.zipCode,
          abortController.signal
        );

        if (response) {
          const { logradouro, bairro, localidade, uf } = response;
          this.editingClient.address.street = logradouro;
          this.editingClient.address.neighborhood = bairro;
          this.editingClient.address.city = localidade;
          this.editingClient.address.state = uf;

          this.cepFound = true;
        } else {
          throw new Error("CEP Não encontrado");
        }
      } catch (error) {
        this.$store.dispatch("snacks/addSnack", {
          message: "Não foi possível encontrar o CEP",
          color: "error",
        });
        console.error(error);
      }

      this.loadingCEP = false;

      return () => {
        abortController.abort();
      };
    },
    editItem(item) {
      this.editingClient = item;
      this.newClientModal = true;
    },
    bulkDelete() {
      this.dialogDelete = true;
    },
    deleteItem(item) {
      this.editingClient = item;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editingClient = {
          address: {
            zipCode: "",
          },
        };
      });
    },
    toggleModal() {
      this.newClientModal = !this.newClientModal;
      this.setErrors([]);
      this.$nextTick(() => {
        this.editingClient = {
          address: {
            zipCode: "",
          },
        };
      });
    },
    setErrors(errors) {
      this.formErrors = getValidationErrors(errors);
    },
  },
  created() {
    this.fetchClients();
  },
  computed: {
    formTitle() {
      return this.editingClient?.id ? "Editar Cliente" : "Novo Cliente";
    },
  },
};
</script>

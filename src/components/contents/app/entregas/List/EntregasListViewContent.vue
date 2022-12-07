<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card flat color="transparent">
    <v-card-title class="d-flex justify-space-between">
      <v-col cols="12" md="2">
        <h1>Entregas</h1>
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
          Nova Entrega
        </v-btn>
      </v-col>
      <v-dialog v-model="newEntregaModal" persistent max-width="600px">
        <v-card :loading="loading">
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>
          <template slot="progress">
            <v-progress-linear color="success" indeterminate height="3" />
          </template>
          <v-card-text>
            <v-form :model="editingEntrega" @submit.prevent="createEntrega">
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    :loading="loading"
                    :disabled="loading"
                    :error-messages="formErrors['client']"
                    :items="clientComboItems"
                    :search-input.sync="clientFilter"
                    label="Selecione o Cliente"
                    v-model="editingEntrega.client"
                    required
                  ></v-combobox>
                </v-col>
                <v-col cols="12">
                  <v-combobox
                    :loading="loading"
                    :disabled="loading"
                    :error-messages="formErrors['products']"
                    :items="productsComboItems"
                    :search-input.sync="productFilter"
                    label="Produtos para entregar"
                    v-model="editingEntrega.products"
                    required
                    chips
                    attach
                    multiple
                  >
                    <template
                      v-slot:selection="{ attrs, item, parent, selected }"
                    >
                      <v-chip
                        v-if="item === Object(item)"
                        v-bind="attrs"
                        color="green lighten-3"
                        :input-value="selected"
                        label
                        small
                      >
                        <span class="pr-2">
                          {{ item.name }}
                        </span>
                        <v-icon small @click="parent.selectItem(item)">
                          $delete
                        </v-icon>
                      </v-chip>
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }}
                    </template>
                  </v-combobox>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    :disabled="loading"
                    :error-messages="formErrors['value']"
                    label="Valor da Entrega"
                    readonly
                    v-model="editingEntrega.value"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-menu
                    ref="pickerMenu"
                    v-model="pickerMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="deliveryDateFormatted"
                        label="Data de Entrega"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :disabled="loading"
                      :error-messages="formErrors['deliveryDate']"
                      label="Data da Entrega"
                      v-model="editingEntrega.deliveryDate"
                      @input="pickerMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <strong>Destino: </strong>
                  <p>{{ editingEntrega.endereco }}</p>
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
              @click="createEntrega()"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="entregas"
        :items-per-page="5"
        :loading="loading"
        v-model="selectedEntregas"
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
            v-if="selectedEntregas.length > 0"
          >
            <v-icon left>mdi-delete</v-icon>
            Excluir Selecionados
          </v-btn>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title v-if="selectedEntregas.length > 0">
                Tem certeza que deseja remover este(s)
                {{ selectedEntregas.length }} Entrega(s)?
              </v-card-title>
              <v-card-title v-else>
                Tem certeza que deseja remover
                {{ editingEntrega?.name }}?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  v-if="selectedEntregas.length > 0"
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
        <template v-slot:item.client="{ item }">
          <div class="d-flex align-center pa-2">
            <v-img
              v-if="item?.cliente?.avatar"
              :src="item.cliente.avatar"
              max-width="50"
              class="rounded-lg mr-2"
              alt=""
            />
            <h4>{{ item.cliente.name }}</h4>
          </div>
        </template>
        <template v-slot:item.products="{ item }">
          <h4>{{ item.produtoIds.length }} Produtos</h4>
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
        <template v-slot:item.value="{ item }">
          {{ item.value }}
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip small :color="chipColor(item.status)">
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ new Date(item.createdAt).toLocaleDateString() }}
        </template>
        <template v-slot:item.deliveryDate="{ item }">
          {{ item.deliveryDate }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { EntregaService } from "@/services/EntregaService";
import { getValidationErrors } from "@/utils/getValidationErrors";
import { ClienteService } from "@/services/ClienteService";
import { ProdutoService } from "@/services/ProdutoService";
import { toCurrency } from "@/helpers";

const defaultEntrega = {
  id: null,
  client: "",
  deliveryDate: "",
  products: [],
  status: "Pendente",
  value: 0,
  createdAt: "",
};

export default {
  name: "EntregasListViewContent",
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({
    loading: false,
    newEntregaModal: false,
    dialogDelete: false,
    pickerMenu: false,
    selectedEntregas: [],
    search: "",
    editingEntrega: defaultEntrega,
    availableProducts: [],
    availableClients: [],
    formErrors: [],
    entregas: [],
    clientFilter: "",
    productFilter: "",
    headers: [
      {
        text: "#",
        sortable: true,
        value: "id",
      },
      {
        text: "Cliente",
        sortable: true,
        value: "client",
      },
      {
        text: "Produtos",
        sortable: true,
        value: "products",
      },
      { text: "Valor", value: "value", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Data do Pedido", value: "createdAt", sortable: false },
      { text: "Previsão de Entrega", value: "deliveryDate", sortable: false },
      { text: "", value: "actions", sortable: false },
    ],
  }),
  validations: {
    editingEntrega: {
      client: {
        required,
      },
      products: {
        required,
      },
      deliveryDate: {
        required,
      },
    },
  },
  methods: {
    async fetchEntregas() {
      this.loading = true;
      const controller = new AbortController();
      const { data } = await EntregaService.getEntregas(controller.signal);

      this.entregas = data;
      this.loading = false;

      return () => controller.abort();
    },
    async fetchProducts() {
      const controller = new AbortController();
      const {
        data: { products },
      } = await ProdutoService.searchProduct(controller.signal);

      this.availableProducts = products;

      return () => controller.abort();
    },
    async deleteItemConfirm() {
      const controller = new AbortController();
      if (this.editingEntrega?.id) {
        await EntregaService.deleteEntrega(
          this.editingEntrega.id,
          controller.signal
        );
        this.fetchEntregas();
      }
      this.closeDelete();
      return () => controller.abort();
    },
    async bulkDeleteItems() {
      const controller = new AbortController();
      if (this.selectedEntregas.length) {
        await EntregaService.bulkDeleteEntregas(
          this.selectedEntregas,
          controller.signal
        );
        this.fetchEntregas();
        this.closeDelete();
        this.selectedEntregas = [];
      }
      return () => controller.abort();
    },
    async createEntrega() {
      this.v$.$touch();

      const controller = new AbortController();

      if (this.v$.$invalid) {
        this.setErrors(this.v$.$errors);
      } else {
        this.loading = true;
        try {
          const createEntrega = await EntregaService.createEntrega(
            {
              ...this.editingEntrega,
              produtoIds: this.availableProducts
                .filter((product) =>
                  this.editingEntrega.products.find((p) => p === product.name)
                )
                .map((product) => product.id),
            },
            controller.signal
          );

          // Caso haja algum erro, tratar no catch
          if (createEntrega.error) {
            throw createEntrega.error;
          }

          // Setamos o fomulário para o estado inicial
          this.editingEntrega = defaultEntrega;

          // Chamamos a atualização dos Entregas
          this.fetchEntregas();

          // Fechamos o Modal
          this.toggleModal();

          this.$nextTick(() => {
            this.$store.dispatch("snacks/addSnack", {
              color: "success",
              text: "Entrega cadastrada com sucesso",
            });
          });
        } catch (error) {
          // Caso não seja possível cadastrar o produto, informamos
          this.$store.dispatch("snacks/addSnack", {
            color: "error",
            text: "Não foi possível cadastrar o produto",
          });
        }
        this.loading = false;
      }

      return () => controller.abort();
    },
    async searchClient() {
      const value = this.clientFilter;
      if (value?.length < 3) {
        return;
      }

      const controller = new AbortController();
      try {
        const { clientes } = await ClienteService.searchClient(
          value,
          controller.signal
        );
        this.availableClients = clientes.map((c) => c);
      } catch (error) {
        this.$store.dispatch("snacks/addSnack", {
          color: "error",
          text: "Não foi possível buscar os clientes",
        });
      }
      return () => {
        controller.abort();
      };
    },
    async searchProduct() {
      const value = this.productFilter;
      if (value?.length < 3) {
        return;
      }

      const controller = new AbortController();
      try {
        const { produtos } = await ProdutoService.searchProduct(
          value,
          controller.signal
        );
        produtos.map((p) => {
          if (this.availableProducts.find((ap) => ap.id === p.id)) {
            return;
          } else {
            this.availableProducts.push(p);
          }
        });
      } catch (error) {
        this.$store.dispatch("snacks/addSnack", {
          color: "error",
          text: "Não foi possível buscar os produtos",
        });
      }
      return () => {
        controller.abort();
      };
    },
    editItem(item) {
      this.editingEntrega = item;
      this.newEntregaModal = true;
    },
    bulkDelete() {
      this.dialogDelete = true;
    },
    deleteItem(item) {
      this.editingEntrega = item;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editingEntrega = defaultEntrega;
      });
    },
    toggleModal() {
      this.newEntregaModal = !this.newEntregaModal;
      this.setErrors([]);
      this.editingEntrega = {};
    },
    setErrors(errors) {
      this.formErrors = getValidationErrors(errors);
    },
    filter(item, queryText, itemText) {
      if (item.header) return false;

      const hasValue = (val) => (val != null ? val : "");

      const text = hasValue(itemText);
      const query = hasValue(queryText);

      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      );
    },
    chipColor(status) {
      switch (status) {
        case "Pendente":
          return "warning";
        case "Entregue":
          return "success";
        case "Cancelado":
          return "error";
        default:
          return "info";
      }
    },
  },
  watch: {
    clientFilter() {
      if (this.clientFilter?.length > 2) {
        this.searchClient();
      }
    },
    productFilter() {
      if (this.productFilter?.length > 2) {
        this.searchProduct();
      }
    },
    "editingEntrega.products": function () {
      if (this.editingEntrega.products) {
        this.editingEntrega.value = toCurrency(
          this.editingEntrega.products.reduce((acc, prod) => {
            return acc + Number(prod.value);
          }, 0)
        );
      }
    },
  },
  created() {
    this.fetchEntregas();
  },
  computed: {
    formTitle() {
      return this.editingEntrega?.id
        ? `Editando ${this.editingEntrega.cliente.name}`
        : "Nova Entrega";
    },
    deliveryDateFormatted() {
      return this.editingEntrega.deliveryDate
        ? this.editingEntrega.deliveryDate.split("-").reverse().join("/")
        : "";
    },
    clientComboItems() {
      return this.availableClients.map((c) => c.name) ?? [];
    },
    productsComboItems() {
      return this.availableProducts.map((p) => p.name) ?? [];
    },
  },
};
</script>

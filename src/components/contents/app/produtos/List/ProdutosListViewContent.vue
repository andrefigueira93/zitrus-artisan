<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card flat color="transparent">
    <v-card-title class="d-flex justify-space-between">
      <v-col cols="12" md="2">
        <h1>Produtos</h1>
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
          Novo Produto
        </v-btn>
      </v-col>
      <v-dialog v-model="newProductModal" persistent max-width="600px">
        <v-card :loading="loading">
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>
          <template slot="progress">
            <v-progress-linear color="success" indeterminate height="3" />
          </template>
          <v-card-text>
            <v-form :model="editingProduct" @submit.prevent="createProduct">
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col
                      v-for="(image, index) in editingProduct.images"
                      :key="index"
                      cols="4"
                    >
                      <v-img
                        :src="image"
                        class="rounded-lg elevation-3"
                        alt="image"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    show-size
                    counter
                    multiple
                    v-model="tempImages"
                    accept="image/png, image/jpeg, image/bmp"
                    color="green"
                    placeholder="Selecione algumas fotos do Produto"
                    prepend-icon="mdi-camera"
                    label="Fotos"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="6" md="9">
                  <v-text-field
                    :disabled="loading"
                    :error-messages="formErrors['name']"
                    label="Nome do Produto"
                    v-model="editingProduct.name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    :disabled="loading"
                    :error-messages="formErrors['value']"
                    label="Valor do Produto"
                    v-model="editingProduct.value"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    :disabled="loading"
                    :error-messages="formErrors['description']"
                    label="Descrição do Produto"
                    v-model="editingProduct.description"
                  ></v-textarea>
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
              @click="createProduct()"
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
        :items="products"
        :items-per-page="5"
        :loading="loading"
        :search="search"
        v-model="selectedProducts"
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
            v-if="selectedProducts.length > 0"
          >
            <v-icon left>mdi-delete</v-icon>
            Excluir Selecionados
          </v-btn>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title v-if="selectedProducts.length > 0">
                Tem certeza que deseja remover este(s)
                {{ selectedProducts.length }} produto(s)?
              </v-card-title>
              <v-card-title v-else>
                Tem certeza que deseja remover
                {{ editingProduct?.name }}?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  v-if="selectedProducts.length > 0"
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
              :src="item.images[0] ?? 'https://picsum.photos/200/300'"
              max-width="50"
              class="rounded-lg mr-2 cursor-pointer"
              alt=""
              @click="toggleGallery(item.images)"
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
        <template v-slot:item.value="{ item }">
          {{
            Number(item.value).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          }}
        </template>
      </v-data-table>
    </v-card-text>
    <v-dialog max-width="800px" class="rounded-lg" v-model="galleryModal">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="toggleGallery">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-carousel
            continuous
            show-arrows
            hide-delimiter-background
            delimiter-icon="mdi-minus"
            v-if="editingProduct.images.length > 0"
          >
            <v-carousel-item
              v-for="(image, i) in editingProduct.images"
              :key="i"
            >
              <v-img
                :src="image"
                :alt="`Imagem ${i} do produto ${editingProduct.name}`"
                contain
              />
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { defaultProduct } from "@/models/Product";
import { ProdutoService } from "@/services/ProdutoService";
import { getValidationErrors } from "@/utils/getValidationErrors";

export default {
  name: "ProdutosListViewContent",
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({
    loading: false,
    newProductModal: false,
    dialogDelete: false,
    selectedProducts: [],
    search: "",
    editingProduct: defaultProduct,
    galleryModal: false,
    formErrors: [],
    products: [],
    tempImages: [],
    headers: [
      {
        text: "#",
        sortable: true,
        value: "id",
      },
      {
        text: "Produto",
        sortable: true,
        value: "name",
      },
      { text: "Valor", value: "value", sortable: false },
      { text: "Descrição", value: "description", sortable: false },
      { text: "", value: "actions", sortable: false },
    ],
  }),
  validations: {
    editingProduct: {
      name: {
        required,
        minLength: minLength(3),
      },
      value: {
        required,
        minLength: minLength(3),
      },
      description: {
        required,
        minLength: minLength(3),
      },
    },
  },
  watch: {
    tempImages() {
      if (this.tempImages.length > 0) {
        let urls = [];
        this.tempImages.forEach((file) => {
          urls.push(URL.createObjectURL(file));
        });
        this.editingProduct.images = urls;
      }
    },
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      const controller = new AbortController();
      const {
        data: { produtos },
      } = await ProdutoService.getProdutos(controller.signal);

      this.products = produtos;
      this.loading = false;

      return () => controller.abort();
    },
    async deleteItemConfirm() {
      const controller = new AbortController();
      if (this.editingProduct?.id) {
        await ProdutoService.deleteProduto(
          this.editingProduct.id,
          controller.signal
        );
        this.fetchProducts();
      }
      this.closeDelete();
      return () => controller.abort();
    },
    async bulkDeleteItems() {
      const controller = new AbortController();
      if (this.selectedProducts.length) {
        await ProdutoService.bulkDeleteProdutos(
          this.selectedProducts,
          controller.signal
        );
        this.fetchProducts();
        this.closeDelete();
        this.selectedProducts = [];
      }
      return () => controller.abort();
    },
    async createProduct() {
      this.v$.$touch();

      const controller = new AbortController();

      if (this.v$.$invalid) {
        this.setErrors(this.v$.$errors);
      } else {
        this.loading = true;
        try {
          const createProduct = await ProdutoService.createProduto(
            this.editingProduct,
            controller.signal
          );

          // Caso haja algum erro, tratar no catch
          if (createProduct.error) {
            throw createProduct.error;
          }

          // Setamos o fomulário para o estado inicial
          this.editingProduct = defaultProduct;

          // Chamamos a atualização dos Produtos
          this.fetchProducts();

          // Fechamos o Modal
          this.toggleModal();
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
    editItem(item) {
      this.editingProduct = item;
      this.newProductModal = true;
    },
    bulkDelete() {
      this.dialogDelete = true;
    },
    deleteItem(item) {
      this.editingProduct = item;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editingProduct = defaultProduct;
      });
    },
    toggleModal() {
      this.newProductModal = !this.newProductModal;
      this.setErrors([]);
      this.tempImages = [];
      this.editingProduct = {
        ...defaultProduct,
        images: [],
      };
    },
    toggleGallery(images) {
      this.galleryModal = !this.galleryModal;

      if (images) {
        this.editingProduct.images = images;
      } else {
        this.editingProduct = {
          images: [],
        };
      }
    },
    setErrors(errors) {
      this.formErrors = getValidationErrors(errors);
    },
  },
  created() {
    this.fetchProducts();
  },
  computed: {
    formTitle() {
      return this.editingProduct?.id
        ? `Editando ${this.editingProduct.name}`
        : "Novo Produto";
    },
  },
};
</script>

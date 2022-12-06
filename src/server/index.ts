import {
  createServer,
  Model,
  Factory,
  ActiveModelSerializer,
  belongsTo,
  hasMany,
  Collection,
} from "miragejs";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { DeliveryStatus } from "@/models/Delivery";
import { randomInt, toCurrency } from "@/helpers";

const statuses = Object.values(DeliveryStatus);

function randomMonth() {
  return randomInt(0, 11);
}

function randomDay() {
  return randomInt(1, 28);
}

export default function ({ environment = "development" } = {}) {
  const models = {
    user: Model,
    cliente: Model,
    produto: Model,
    entrega: Model.extend({
      cliente: belongsTo(),
      produtos: hasMany(),
    }),
  };

  const productsCreated: any[] = [];
  const clientsCreated: any[] = [];

  let orderValue = 0;

  createServer({
    environment,
    models,
    factories: {
      user: Factory.extend({
        id(i) {
          return i;
        },
        avatar() {
          return faker.image.avatar();
        },
        username(i) {
          if (i === 0) {
            return "zitrino";
          } else {
            return faker.internet.userName();
          }
        },
        password() {
          return "venhaserfeliz";
        },
      }),
      cliente: Factory.extend({
        id(i) {
          return i + 1;
        },
        avatar() {
          return faker.image.avatar();
        },
        name() {
          return faker.name.fullName();
        },
        email() {
          return faker.internet.email();
        },
        phone() {
          return faker.phone.number();
        },
        address(i) {
          return {
            street: faker.address.street(),
            number: faker.address.buildingNumber(),
            complement: `Complemento ${i + 1}`,
            neighborhood: faker.address.street(),
            city: faker.address.cityName(),
            state: faker.address.stateAbbr(),
            zipCode: faker.address.zipCode(),
          };
        },
      }),
      produto: Factory.extend({
        id(i) {
          return i + 1;
        },
        name() {
          return faker.commerce.productName();
        },
        value() {
          return faker.commerce.price();
        },
        images() {
          const images: string[] = [];
          for (let i = 0; i < 3; i++) {
            images.push(faker.image.abstract());
          }
          return images;
        },
        description() {
          return faker.lorem.paragraph();
        },
      }),
      entrega: Factory.extend({
        id(i) {
          return i + 1;
        },
        clienteId() {
          return randomInt(1, clientsCreated.length);
        },
        produtos() {
          const products: any[] = [];
          const limit = randomInt(1, productsCreated.length);
          for (let i = 0; i < limit; i++) {
            products.push(productsCreated[randomInt(1, 10)]);
          }

          orderValue = products.reduce((acc, prod) => {
            const product = productsCreated.find(
              (p) => p.attrs.id === prod.attrs.id
            );
            return acc + Number(product.value);
          }, 0);

          return products;
        },
        value() {
          return orderValue;
        },
        status() {
          return statuses[randomInt(0, 3)];
        },
        createdAt() {
          return new Date(2022, randomMonth(), randomDay()).toISOString();
        },
        deliveryDate() {
          return new Date(2022, randomMonth(), randomDay()).toISOString();
        },
      }),
    },
    serializers: {
      application: ActiveModelSerializer,
    },
    seeds(server) {
      server.createList("user", 5);
      server.createList("produto", 20).forEach((product) => {
        productsCreated.push(product);
      });
      server.createList("cliente", 10).forEach((client) => {
        clientsCreated.push(client);
      });
      server.createList("entrega", 20);
    },
    routes() {
      this.namespace = "api";
      // Rotas de CRUD de Usuário
      this.get(`/users`);
      this.get(`/users/:id`);
      this.post(`/users`, (schema, request) => {
        const data = JSON.parse(request.requestBody);
        return schema.create("user", data);
      });
      this.patch(`/users/:id`);
      this.del(`/users/:id`);

      // Rotas de CRUD de Clientes
      this.get(`/clientes`);
      this.get(`/clientes/:id`);
      this.get(`/clientes/search/:name`, (schema, request) => {
        const name = request.params.name;
        const data = schema.where("cliente", (cli) => {
          return cli.name.toLowerCase().includes(name.toLowerCase());
        });
        return data;
      });
      this.post(`/clientes`, (schema, request) => {
        const data = JSON.parse(request.requestBody);
        return schema.create("cliente", data);
      });
      this.patch(`/clientes/:id`);
      this.del(`/clientes/:id`);
      this.del(`/clientes/bulk`, (schema, request) => {
        const data = JSON.parse(request.requestBody);
        data.forEach((client: any) => {
          schema.db.clientes.remove(client);
        });
        return schema.db.clientes;
      });

      // Rotas de CRUD de Produtos
      this.get(`/produtos`);
      this.get(`/produtos/:id`);
      this.get(`/produtos/search/:name`, (schema, request) => {
        const name = request.params.name;
        const pData = schema.where("produto", (cli) => {
          return cli.name.toLowerCase().includes(name.toLowerCase());
        });
        return pData;
      });
      this.post(`/produtos`, (schema, request) => {
        const data = JSON.parse(request.requestBody);
        return schema.create("produto", data);
      });
      this.patch(`/produtos/:id`, (schema, request) => {
        const data = JSON.parse(request.requestBody);
        return schema.db.produto.update(data.id, data);
      });
      this.del(`/produtos/:id`);
      this.del(`/produtos/bulk`, (schema, request) => {
        const data = JSON.parse(request.requestBody);
        data.forEach((prod: any) => {
          schema.db.produtos.remove(prod.id);
        });
        return schema.db.produtos;
      });
      // Rotas de CRUD de Entregas
      this.get(`/entregas`, (schema) => {
        const entregs = schema.all("entrega");

        const jsonEntregs = entregs.models.map((entreg) => {
          const cli = clientsCreated.find(
            (c) => Number(c.attrs.id) === Number(entreg.attrs.clienteId)
          );
          const endereco = Object.values(cli.attrs.address).join(", ");
          const currencyValue = toCurrency(entreg.value);
          return {
            ...entreg.attrs,
            cliente: cli,
            client: cli.name,
            endereco,
            value: currencyValue,
            deliveryDate: new Date(
              entreg.attrs.deliveryDate
            ).toLocaleDateString("pt-BR"),
            products: productsCreated.filter((p) => {
              const currentProductId = Number(p.attrs.id);
              const { attrs } = entreg as any;
              const entregaProductIds = attrs.produtoIds.map((id: string) =>
                Number(id)
              );
              return entregaProductIds.includes(currentProductId);
            }),
          };
        });

        return jsonEntregs;
      });
      this.get(`/entregas/:id`);
      this.post(`/entregas`, (schema, request) => {
        const data = JSON.parse(request.requestBody);

        const parsedValue = data.value.replace("R$", "").replace(",", ".");
        const parsedDate = data.deliveryDate.split("/").reverse().join("-");
        const cliente = clientsCreated.find((c) => {
          return c.attrs.name === data.client;
        });

        const newData = {
          ...data,
          cliente,
          value: Number(parsedValue),
          deliveryDate: parsedDate,
          status: "Pendente",
          createdAt: new Date().toISOString(),
        };

        return schema.create("entrega", newData);
      });
      this.patch(`/entregas/:id`, (schema, request) => {
        const data = JSON.parse(request.requestBody);
        return schema.db.entregas.update(data.id, data);
      });
      this.del(`/entregas/:id`);
      this.del(`/entregas/bulk`, (schema, request) => {
        const data = JSON.parse(request.requestBody);
        data.forEach(({ id }: any) => {
          schema.db.entregas.remove({ id });
        });
        return schema.db.entregas;
      });

      this.post("/auth/signin", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        const findUser = schema?.findBy("user", {
          username: attrs.username,
          password: attrs.password,
        });

        if (findUser) {
          return {
            user: {
              id: findUser.id,
              username: findUser.username,
            },
          };
        }

        return {
          error: "Usuário ou senha inválidos",
        };
      });

      this.passthrough("https://opencep.com/v1/**");
    },
  });
}

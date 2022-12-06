import Client from "./Client";
import Product from "./Product";

export enum DeliveryStatus {
  "Pendente",
  "Em Rota",
  "Cancelado",
  "Entregue",
}

export default class Delivery {
  id: number;
  client: Partial<Client>;
  products: Partial<Product>[];
  value?: number;
  status: DeliveryStatus;
  "delivery_date": Date | string;
  "created_at": Date | string;

  constructor(
    id: number,
    client: Partial<Client>,
    products: Partial<Product>[],
    createdAt: Date | string,
    deliveryDate: Date | string,
    value: number,
    status: DeliveryStatus
  ) {
    this.id = id;
    this.products = products;
    this.client = client;
    this.created_at = createdAt;
    this.delivery_date = deliveryDate;
    this.value = value;
    this.status = status;
  }
}

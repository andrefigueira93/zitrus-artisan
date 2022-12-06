export default class Product {
  name: string;
  value: number;
  images: string[];
  description: string;

  constructor(
    name: string,
    value: number,
    images: string[],
    description: string
  ) {
    this.name = name;
    this.value = value;
    this.images = images;
    this.description = description;
  }
}

export const defaultProduct: Product = {
  name: "",
  value: 0,
  images: [],
  description: "",
};

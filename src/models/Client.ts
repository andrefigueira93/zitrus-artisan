type Address = {
  street: string;
  number?: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

export default class Client {
  id?: number;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  address: Address;

  constructor(
    avatar: string,
    name: string,
    email: string,
    phone: string,
    address: Address
  ) {
    this.avatar = avatar;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }
}

export const defaultClient: Client = {
  avatar: "",
  name: "",
  email: "",
  phone: "",
  address: {
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  },
};

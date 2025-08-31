export interface Product {
  _id: string,
  name: string,
  sku: string,
  category: string,
  quantity: string,
  price: number,
  description: string,
  image: string,
  user? : {
    _id: string,
    name: string,
    email: string
  };

  createdAt?: string,
  updatedAt?: string,
}
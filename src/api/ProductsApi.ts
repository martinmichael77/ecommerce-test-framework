import { ApiClient } from './ApiClient';

export class ProductsApi {
  constructor(private client: ApiClient) {}

  async getAllProducts() {
    return this.client.get('/api/productsList');
  }

  async searchProduct(searchTerm: string) {
    return this.client.postForm('/api/searchProduct', { search_product: searchTerm });
  }
}
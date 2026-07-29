import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/ApiClient';
import { ProductsApi } from '../../src/api/ProductsApi';

test.describe('Products API', () => {
  let apiClient: ApiClient;
  let productsApi: ProductsApi;

  test.beforeAll(async () => {
    apiClient = new ApiClient('https://www.automationexercise.com');
    await apiClient.init();
    productsApi = new ProductsApi(apiClient);
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test('GET all products returns 200 and a product list', async () => {
    const response = await productsApi.getAllProducts();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.products).toBeDefined();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('GET all products - validate product schema', async () => {
    const response = await productsApi.getAllProducts();
    const body = await response.json();
    const firstProduct = body.products[0];

    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('name');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('brand');
    expect(firstProduct).toHaveProperty('category');
  });

    test('POST search product returns matching results', async () => {
    const response = await productsApi.searchProduct('Top');
    const body = await response.json();
    console.log(JSON.stringify(body, null, 2)); // TEMP DEBUG
    expect(response.status()).toBe(200);
    expect(body.products).toBeDefined();
    });

  test('POST search with empty term - negative case', async () => {
    const response = await productsApi.searchProduct('');
    expect(response.status()).toBe(200);
    // Document actual behavior - does it return all products or an error?
    const body = await response.json();
    expect(body.responseCode).toBeDefined();
  });
});
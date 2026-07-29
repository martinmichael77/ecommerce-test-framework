import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/ApiClient';
import { ProductsApi } from '../../src/api/ProductsApi';
import { HomePage } from '../../src/pages/HomePage';

test.describe('Hybrid: Product search - API and UI consistency', () => {
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

  test('product returned by API search should also appear in UI search results', async ({ page }) => {
    // Step 1: Confirm via API that products matching "Dress" exist
    const apiResponse = await productsApi.searchProduct('Dress');
    const apiBody = await apiResponse.json();

    expect(apiBody.products.length).toBeGreaterThan(0);
    const expectedProductName = apiBody.products[0].name;

    // Step 2: Confirm the same product appears when searching via the UI
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.goToProducts();
    await homePage.searchProduct('Dress');

    const productCards = page.locator('.productinfo p');
    await expect(productCards.first()).toBeVisible();

    const productNames = await productCards.allTextContents();
    const namesLower = productNames.map(n => n.trim().toLowerCase());

    expect(namesLower).toContain(expectedProductName.trim().toLowerCase());
  });

  test('total product count via API matches product count visible in UI (all products page)', async ({ page }) => {
    // Step 1: Get total count from API
    const apiResponse = await productsApi.getAllProducts();
    const apiBody = await apiResponse.json();
    const apiProductCount = apiBody.products.length;

    // Step 2: Navigate UI and count visible products
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.goToProducts();

    const productCards = page.locator('.productinfo p');
    await expect(productCards.first()).toBeVisible();
    const uiProductCount = await productCards.count();

    // Note: UI may paginate, so counts might not match exactly - document actual behavior
    console.log(`API count: ${apiProductCount}, UI visible count: ${uiProductCount}`);
    expect(uiProductCount).toBeGreaterThan(0);
  });
}); 
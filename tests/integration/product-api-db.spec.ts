import { test, expect } from '@playwright/test';
import { DatabaseClient } from '../../src/db/DatabaseClient';
import { DatabaseSeeder } from '../../src/db/DatabaseSeeder';

test.describe('Product API → Database integration', () => {
  let db: DatabaseClient;
  let seeder: DatabaseSeeder;

  test.beforeAll(async () => {
    db = new DatabaseClient();
    seeder = new DatabaseSeeder(db);

    await seeder.clearProducts();
  });

  test.afterAll(async () => {
    await seeder.clearProducts();
    await db.close();
  });

  test('should persist a product created through the API', async ({
    request,
  }) => {
    const product = {
      name: 'Integration Test Product',
      price: 1499,
      brand: 'SDET Test Brand',
      category: 'Automation',
    };

    const response = await request.post(
      'http://localhost:3000/api/products',
      {
        data: product,
      },
    );

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.product).toMatchObject({
      name: product.name,
      brand: product.brand,
      category: product.category,
    });

    const productId = responseBody.product.id;

    const dbProducts = await db.query<{
      id: number;
      name: string;
      price: string;
      brand: string;
      category: string;
    }>(
      `
      SELECT id, name, price, brand, category
      FROM products
      WHERE id = $1
      `,
      [productId],
    );

    expect(dbProducts).toHaveLength(1);

    expect(dbProducts[0]).toMatchObject({
      id: productId,
      name: product.name,
      price: '1499.00',
      brand: product.brand,
      category: product.category,
    });
  });
});
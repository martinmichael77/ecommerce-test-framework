import { test, expect } from '@playwright/test';
import { DatabaseClient } from '../../src/db/DatabaseClient';
import { DatabaseSeeder } from '../../src/db/DatabaseSeeder';

test.describe('Database validation', () => {
  let db: DatabaseClient;
  let seeder: DatabaseSeeder;

  test.beforeAll(async () => {
    db = new DatabaseClient();
    seeder = new DatabaseSeeder(db);

    await seeder.clearSeededProducts();
    await seeder.seedProducts();
  });

  test.afterAll(async () => {
    await seeder.clearSeededProducts();
    await db.close();
  });

  test('should verify seeded products exist in PostgreSQL', async () => {
    const products = await db.query<{
      id: number;
      name: string;
      price: string;
      brand: string;
      category: string;
    }>(
      `
      SELECT id, name, price, brand, category
      FROM products
      ORDER BY id
      `,
    );

    expect(products).toHaveLength(3);

    expect(products[0]).toMatchObject({
      name: 'Blue Top',
      price: '500.00',
      brand: 'Polo',
      category: 'Tops',
    });

    expect(products[1]).toMatchObject({
      name: 'Winter Top',
      price: '600.00',
      brand: 'Mast & Harbour',
      category: 'Tops',
    });

    expect(products[2]).toMatchObject({
      name: 'Summer White Top',
      price: '400.00',
      brand: 'H&M',
      category: 'Tops',
    });
  });
});
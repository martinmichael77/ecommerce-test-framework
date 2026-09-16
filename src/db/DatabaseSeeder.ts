import { DatabaseClient } from './DatabaseClient';

export class DatabaseSeeder {
  constructor(private readonly db: DatabaseClient) {}

  async seedProducts(): Promise<void> {
    await this.db.query(
      `
      INSERT INTO products (name, price, brand, category)
      VALUES
        ($1, $2, $3, $4),
        ($5, $6, $7, $8),
        ($9, $10, $11, $12)
      `,
      [
        'Blue Top',
        500,
        'Polo',
        'Tops',
        'Winter Top',
        600,
        'Mast & Harbour',
        'Tops',
        'Summer White Top',
        400,
        'H&M',
        'Tops',
      ],
    );
  }

  async clearSeededProducts(): Promise<void> {
    await this.db.query(
      `
      DELETE FROM products
      WHERE name IN ($1, $2, $3)
      `,
      ['Blue Top', 'Winter Top', 'Summer White Top'],
    );
  }
}
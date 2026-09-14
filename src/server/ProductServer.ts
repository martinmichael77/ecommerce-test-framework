import express, { Request, Response } from 'express';
import { DatabaseClient } from '../db/DatabaseClient';

export class ProductServer {
  private readonly app = express();
  private readonly db: DatabaseClient;

  constructor(db: DatabaseClient) {
    this.db = db;

    this.app.use(express.json());

    this.app.post('/api/products', this.createProduct.bind(this));
    this.app.get('/api/products/:id', this.getProduct.bind(this));
  }

  private async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, price, brand, category } = req.body;

      if (!name || price === undefined || !brand || !category) {
        res.status(400).json({
          error: 'name, price, brand and category are required',
        });
        return;
      }

      const products = await this.db.query<{
        id: number;
        name: string;
        price: string;
        brand: string;
        category: string;
        created_at: Date;
      }>(
        `
        INSERT INTO products (name, price, brand, category)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, price, brand, category, created_at
        `,
        [name, price, brand, category],
      );

      res.status(201).json({
        product: products[0],
      });
    } catch (error) {
      console.error('Failed to create product:', error);

      res.status(500).json({
        error: 'Failed to create product',
      });
    }
  }

  private async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          error: 'Invalid product ID',
        });
        return;
      }

      const products = await this.db.query<{
        id: number;
        name: string;
        price: string;
        brand: string;
        category: string;
        created_at: Date;
      }>(
        `
        SELECT id, name, price, brand, category, created_at
        FROM products
        WHERE id = $1
        `,
        [id],
      );

      if (products.length === 0) {
        res.status(404).json({
          error: 'Product not found',
        });
        return;
      }

      res.status(200).json({
        product: products[0],
      });
    } catch (error) {
      console.error('Failed to retrieve product:', error);

      res.status(500).json({
        error: 'Failed to retrieve product',
      });
    }
  }

  getApp() {
    return this.app;
  }
}   
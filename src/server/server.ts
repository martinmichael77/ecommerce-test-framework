import { DatabaseClient } from '../db/DatabaseClient';
import { ProductServer } from './ProductServer';

const db = new DatabaseClient();
const server = new ProductServer(db);

const port = Number(process.env.API_PORT) || 3000;

const app = server.getApp();

const httpServer = app.listen(port, () => {
  console.log(`Product API running on http://localhost:${port}`);
});

const shutdown = async () => {
  httpServer.close();
  await db.close();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
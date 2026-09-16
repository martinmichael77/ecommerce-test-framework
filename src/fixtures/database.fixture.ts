import { test as base } from '@playwright/test';
import { DatabaseClient } from '../db/DatabaseClient';
import { DatabaseSeeder } from '../db/DatabaseSeeder';

type DatabaseFixtures = {
  db: DatabaseClient;
  seeder: DatabaseSeeder;
};

export const test = base.extend<DatabaseFixtures>({
  db: async ({}, use) => {
    const db = new DatabaseClient();

    await use(db);

    await db.close();
  },

  seeder: async ({ db }, use) => {
    const seeder = new DatabaseSeeder(db);

    await use(seeder);
  },
});

export { expect } from '@playwright/test';
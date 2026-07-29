import { APIRequestContext, request } from '@playwright/test';

export class ApiClient {
  private context: APIRequestContext | null = null;
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async init() {
    this.context = await request.newContext({
      baseURL: this.baseURL,
    });
    return this.context;
  }

  async get(endpoint: string) {
    if (!this.context) throw new Error('ApiClient not initialized. Call init() first.');
    return this.context.get(endpoint);
  }

  async post(endpoint: string, data: object) {
    if (!this.context) throw new Error('ApiClient not initialized. Call init() first.');
    return this.context.post(endpoint, { data });
  }

  // For legacy endpoints expecting form-urlencoded data instead of JSON
  async postForm(endpoint: string, form: Record<string, string>) {
    if (!this.context) throw new Error('ApiClient not initialized. Call init() first.');
    return this.context.post(endpoint, { form });
  }

  async dispose() {
    if (this.context) await this.context.dispose();
  }
}
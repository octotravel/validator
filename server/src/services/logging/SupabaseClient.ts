import { createClient, SupabaseClient as SupabaseDBClient } from '@supabase/supabase-js';

export class SupabaseClient {
  private client: SupabaseDBClient;
  
  constructor() {
    this.client = this.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  private createClient = (url: string, key: string): SupabaseDBClient => {
    return createClient(url, key, {
      fetch: fetch.bind(globalThis),
    });
  };
  public getClient = (): SupabaseDBClient => {
    return this.client;
  };
}

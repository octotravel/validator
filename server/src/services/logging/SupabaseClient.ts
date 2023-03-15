import { createClient, SupabaseClient as SupabaseDBClient } from 'https://esm.sh/@supabase/supabase-js@1.28.1';
import { Config } from './Config.ts';

export class SupabaseClient {
  private config = new Config();

  private client: SupabaseDBClient;
  constructor() {
    this.client = this.createClient(this.config.supabaseUrl, this.config.supabaseKey);
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

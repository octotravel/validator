// @ts-ignore
const ENVIRONMENT: string = globalThis.ENVIRONMENT;
// @ts-ignore
const SUPABASE_URL: string = globalThis.SUPABASE_URL;
// @ts-ignore
const SUPABASE_KEY: string = globalThis.SUPABASE_KEY;

export class Config {
  public supabaseUrl = SUPABASE_URL;
  public supabaseKey = SUPABASE_KEY;
}

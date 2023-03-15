// @ts-ignore
const SUPABASE_URL: string = Deno.env.get("SUPABASE_URL");
// @ts-ignore
const SUPABASE_KEY: string = Deno.env.get("SUPABASE_KEY");

export class Config {
  public supabaseUrl = SUPABASE_URL;
  public supabaseKey = SUPABASE_KEY;
}

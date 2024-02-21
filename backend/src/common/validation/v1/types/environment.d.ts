export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
    }
  }
}

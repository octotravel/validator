import { PostgrestResponse } from 'https://esm.sh/@supabase/supabase-js@1.28.1';
import { SupabaseClient } from './SupabaseClient.ts';
import { SupabaseRequest } from './types.ts';

export class LoggerRepository {
  private client = new SupabaseClient().getClient();

  public set = async (
    request: Omit<SupabaseRequest, 'created_at' | 'fts'>,
  ): Promise<PostgrestResponse<Omit<SupabaseRequest, 'created_at' | 'fts'>> | null> => {
    const response = await this.setRequest(request, 3);
    if (response === null || response.error !== null) {
      console.log('row insert failed');
    }
    return response;
  };

  private setRequest = async (
    request: Omit<SupabaseRequest, 'created_at' | 'fts'>,
    counter: number,
  ): Promise<PostgrestResponse<Omit<SupabaseRequest, 'created_at' | 'fts'>> | null> => {
    if (counter === 0) {
      return null;
    }
    const response = await this.client.from('request').insert(request, {
      returning: 'minimal',
    });

    if (response.error) {
      return await this.setRequest(request, counter - 1);
    }
    return response;
  };
}

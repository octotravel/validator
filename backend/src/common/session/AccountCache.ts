import { Account } from '@octocloud/core';
import { inject, singleton } from 'tsyringe';
import { ICache } from '../cache/ICache';
import { RedisStorage } from '../cache/storage/redis/RedisStorage';

@singleton()
export class AccountCache implements ICache<Account> {
  public constructor(@inject(RedisStorage) private readonly redisStorage: RedisStorage) {}

  public async get(id: string): Promise<Account | null> {
    const cachedAccount = await this.redisStorage.get(id);

    if (cachedAccount === null) {
      return null;
    }

    return JSON.parse(cachedAccount) as Account;
  }

  public async set(id: string, value: Account): Promise<void> {
    await this.redisStorage.set(id, JSON.stringify(value));
  }

  public async delete(id: string): Promise<void> {
    this.redisStorage.delete(id);
  }
}

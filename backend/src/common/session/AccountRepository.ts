import { inject, singleton } from 'tsyringe';
import { Account, IAccountRepository, AccountData, GetAccountData } from '@octocloud/core';
import { PostgresAccountRepository } from './PostgresAccountRepository';
import { AccountCache } from './AccountCache';
import { PostgresConnectionRepository } from '../connection/PostgresConnectionRepository';
import { Database } from '../../database/Database';

@singleton()
export class AccountRepository implements IAccountRepository {
  public constructor(
    @inject(Database) private readonly database: Database,
    @inject(PostgresAccountRepository) private readonly postgresAccountRepository: PostgresAccountRepository,
    @inject(PostgresConnectionRepository)
    private readonly postgresConnectionRepository: PostgresConnectionRepository,
    @inject(AccountCache) private readonly cache: AccountCache,
  ) {}

  public async create(accountData: AccountData): Promise<void> {
    await this.postgresAccountRepository.create({
      id: accountData.id,
      name: accountData.name,
      api_key: accountData.apiKey,
    });

    const account = {
      id: accountData.id,
      name: accountData.name,
      apiKey: accountData.apiKey,
      connectionIds: [],
    };

    this.cache.set(account.id, account);
  }

  public async update(accountData: AccountData): Promise<void> {
    await this.postgresAccountRepository.update({
      id: accountData.id,
      name: accountData.name,
      api_key: accountData.apiKey,
    });

    const accountConnectionIds = await this.postgresConnectionRepository.getIdsForAccount(accountData.id);

    const account = {
      id: accountData.id,
      name: accountData.name,
      apiKey: accountData.apiKey,
      connectionIds: accountConnectionIds,
    };

    this.cache.set(account.id, account);
  }

  public async get(id: string): Promise<Account | null> {
    const cachedAccount = await this.cache.get(id);

    if (cachedAccount !== null) {
      return cachedAccount;
    }

    const accountData = await this.postgresAccountRepository.get(id);
    if (accountData === null) {
      return null;
    }

    const accountConnectionIds = await this.postgresConnectionRepository.getIdsForAccount(id);

    const account = {
      id: accountData.id,
      name: accountData.name,
      apiKey: accountData.api_key,
      connectionIds: accountConnectionIds,
    };

    this.cache.set(id, account);

    return account;
  }

  public async getAll(): Promise<GetAccountData[]> {
    return await this.postgresAccountRepository.getAll();
  }

  public async delete(id: string): Promise<void> {
    const accountConnectionIds = await this.postgresConnectionRepository.getIdsForAccount(id);

    try {
      await this.database.startTransaction();

      for (const connectionId of accountConnectionIds) {
        await this.postgresConnectionRepository.delete(connectionId);
      }

      await this.postgresAccountRepository.delete(id);

      await this.database.commitTransaction();
    } catch (e: any) {
      await this.database.rollbackTransaction();
    }

    await this.cache.delete(id);
  }
}

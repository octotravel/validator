import { v4 as uuidv4 } from 'uuid';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Database } from '../../../database/Database';
import { octoContainer } from '../../../di';
import { PostgresAccountRepository } from '../PostgresAccountRepository';
import { AccountRowData } from '../../../types/database';

describe('PostgresAccountRepository', () => {
  let database: Database;
  let postgresAccountRepository: PostgresAccountRepository;

  beforeAll(async () => {
    database = octoContainer.resolve(Database);
    postgresAccountRepository = octoContainer.resolve(PostgresAccountRepository);
  });

  afterEach(async () => {
    await database.getConnection().query('DELETE FROM account');
  });

  describe('getAll', () => {
    it('should get all accounts', async () => {
      const id = uuidv4();
      const secondId = uuidv4();

      const accountRowsData = [
        {
          id,
          name: 'testAccount',
          api_key: id,
        },
        {
          id: secondId,
          name: 'secondTestAccountName',
          api_key: secondId,
        },
      ];

      await Promise.all(
        accountRowsData.map(async (accountRowData: AccountRowData) => {
          await postgresAccountRepository.create(accountRowData);
        }),
      );

      const actualAccountRowsData = await postgresAccountRepository.getAll();
      const actualSortedAccountRowsData = actualAccountRowsData.sort((a, b) => {
        return a.id.localeCompare(b.id);
      });

      const expectedAccountRowsData = [
        {
          id: accountRowsData[0].id,
          name: accountRowsData[0].name,
          api_key: accountRowsData[0].api_key,
        },
        {
          id: accountRowsData[1].id,
          name: accountRowsData[1].name,
          api_key: accountRowsData[1].api_key,
        },
      ];

      const expectedSortedAccountRowsData = expectedAccountRowsData.sort((a, b) => {
        return a.id.localeCompare(b.id);
      });

      expect(expectedSortedAccountRowsData).toEqual(actualSortedAccountRowsData);
    });
  });

  describe('create', () => {
    it('should create new account', async () => {
      const id = uuidv4();
      const accountRowData: AccountRowData = {
        id,
        name: 'testAccount',
        api_key: id,
      };

      await postgresAccountRepository.create(accountRowData);
      const actualAccountRowData = await postgresAccountRepository.get(accountRowData.id);

      expect(accountRowData).toStrictEqual(actualAccountRowData);
    });
  });

  describe('update', () => {
    it('should update existing account', async () => {
      const id = uuidv4();
      const accountRowData: AccountRowData = {
        id,
        name: 'createdTestAccount',
        api_key: id,
      };

      await postgresAccountRepository.create(accountRowData);

      const updatedAccountRowData: AccountRowData = {
        id,
        name: 'updatedTestAccount',
        api_key: id,
      };

      await postgresAccountRepository.update(updatedAccountRowData);
      const actualAccountRowData = await postgresAccountRepository.get(accountRowData.id);

      expect(updatedAccountRowData).toStrictEqual(actualAccountRowData);
    });
  });

  describe('delete', () => {
    it('should delete existing account', async () => {
      const id = uuidv4();
      const accountRowData: AccountRowData = {
        id,
        name: 'testAccount',
        api_key: id,
      };

      await postgresAccountRepository.create(accountRowData);
      await postgresAccountRepository.delete(accountRowData.id);
      const actualAccountRowData = await postgresAccountRepository.get(accountRowData.id);

      expect(actualAccountRowData).toStrictEqual(null);
    });
  });
});

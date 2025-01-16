import * as fs from 'node:fs';
import { injectable } from '@needle-di/core';
import { Vault } from 'ansible-vault';
import { packageDirectory } from 'pkg-dir';
import { container } from '../../common/di/container';
import { ConsoleLoggerFactory } from '../../common/logger/ConsoleLoggerFactory';
import { LoggerFactory } from '../../common/logger/LoggerFactory';
import { Command } from './Command';

@injectable()
export class AnsibleEncryptCommand implements Command {
  public getSlug = (): string => {
    return 'ansible-encrypt';
  };

  public run = async (envFileName: string): Promise<void> => {
    const consoleLoggerFactory: LoggerFactory = container.get(ConsoleLoggerFactory);
    const consoleLogger = consoleLoggerFactory.create();

    try {
      if (!envFileName || envFileName === '') {
        throw new Error('Env file name not provided.');
      }

      const rootDirectory = await packageDirectory();
      const passwordFile = '.ansible-password';
      let password = '';

      const passwordFileExists = fs.existsSync(passwordFile);
      if (!passwordFileExists) {
        throw new Error(`Password file "${passwordFile}" doesn't exists.`);
      }

      const envFileExists = fs.existsSync(envFileName);
      if (!envFileExists) {
        throw new Error(`Env file "${envFileName}" doesn't exists.`);
      }

      try {
        password = fs.readFileSync(`${rootDirectory}/${passwordFile}`, 'utf-8');
      } catch (e: unknown) {
        throw new Error(`Can't read "${passwordFile}" file content.`);
      }

      let decryptedEnvFileContent = '';

      try {
        decryptedEnvFileContent = fs.readFileSync(`${rootDirectory}/${envFileName}`, 'utf-8');
      } catch (e: unknown) {
        throw new Error(`Can't read "${envFileName}" file content.`);
      }

      const ansibleVault = new Vault({ password });
      let encryptedEnvFileContent = '';

      try {
        encryptedEnvFileContent = ansibleVault.encryptSync(decryptedEnvFileContent, '')!;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'unknown';
        throw new Error(`Can't encrypt "${envFileName}" file content, "${message}" error occured.`);
      }

      try {
        fs.writeFileSync(envFileName, encryptedEnvFileContent);
      } catch (e: unknown) {
        throw new Error(`Can't write content to file "${envFileName}".`);
      }
    } catch (err: unknown) {
      await consoleLogger.error(err);
    }
  };
}

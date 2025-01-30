import * as fs from 'node:fs';
import { inject } from '@needle-di/core';
import { Logger } from '@octocloud/core';
import { Vault } from 'ansible-vault';
import { packageDirectory } from 'pkg-dir';
import { ConsoleLoggerFactory } from '../../common/logger/ConsoleLoggerFactory';
import { Command } from './Command';

export class AnsibleDecryptCommand implements Command {
  public constructor(
    private readonly consoleLoggerFactory = inject(ConsoleLoggerFactory),
    private readonly consoleLogger: Logger,
  ) {
    this.consoleLogger = this.consoleLoggerFactory.create();
  }

  public getSlug = (): string => {
    return 'ansible-decrypt';
  };

  public run = async (envFileName: string): Promise<void> => {
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

      let encryptedEnvFileContent = '';

      try {
        encryptedEnvFileContent = fs.readFileSync(`${rootDirectory}/${envFileName}`, 'utf-8');
      } catch (e: unknown) {
        throw new Error(`Can't read "${envFileName}" file content.`);
      }

      const ansibleVault = new Vault({ password });
      let decryptedEnvFileContent = '';

      try {
        decryptedEnvFileContent = ansibleVault.decryptSync(encryptedEnvFileContent, undefined)!;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'unknown';
        throw new Error(`Can't decrypt "${envFileName}" file content, "${message}" error occured.`);
      }

      try {
        fs.writeFileSync(envFileName, decryptedEnvFileContent);
      } catch (e: unknown) {
        throw new Error(`Can't write content to file "${envFileName}".`);
      }
    } catch (err: unknown) {
      await this.consoleLogger.error(err);
    }
  };
}

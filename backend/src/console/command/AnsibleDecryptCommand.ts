import * as fs from 'fs';
import { Vault } from 'ansible-vault';
import { packageDirectory } from 'pkg-dir';
import { Command } from './Command';
import { ConsoleLoggerFactory } from '../../common/logger/ConsoleLoggerFactory';
import { Logger } from '@octocloud/core';
import { inject } from '@needle-di/core';

export class AnsibleDecryptCommand implements Command {
  public constructor(
    private readonly consoleLoggerFactory: ConsoleLoggerFactory = inject(ConsoleLoggerFactory),
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
      } catch (e: any) {
        throw new Error(`Can't read "${passwordFile}" file content.`);
      }

      let encryptedEnvFileContent = '';

      try {
        encryptedEnvFileContent = fs.readFileSync(`${rootDirectory}/${envFileName}`, 'utf-8');
      } catch (e: any) {
        throw new Error(`Can't read "${envFileName}" file content.`);
      }

      const ansibleVault = new Vault({ password });
      let decryptedEnvFileContent = '';

      try {
        decryptedEnvFileContent = ansibleVault.decryptSync(encryptedEnvFileContent, undefined)!;
      } catch (e: any) {
        throw new Error(`Can't decrypt "${envFileName}" file content, following error occured: "${e.message}".`);
      }

      try {
        fs.writeFileSync(envFileName, decryptedEnvFileContent);
      } catch (e: any) {
        throw new Error(`Can't write content to file "${envFileName}".`);
      }
    } catch (err: any) {
      await this.consoleLogger.error(err);
    }
  };
}

import * as fs from 'fs';
import { Vault } from 'ansible-vault';
import { packageDirectory } from 'pkg-dir';
import { LoggerFactory } from '../../common/logger/LoggerFactory';
import { singleton, registry } from 'tsyringe';
import { Command } from './Command';
import { ConsoleLoggerFactory } from '../../common/logger/ConsoleLoggerFactory';
import { container } from '../../common/di/container';

@singleton()
@registry([
  { token: AnsibleEncryptCommand.name, useClass: AnsibleEncryptCommand },
  { token: 'Command', useClass: AnsibleEncryptCommand },
])
export class AnsibleEncryptCommand implements Command {
  public getSlug = (): string => {
    return 'ansible-encrypt';
  };

  public run = async (envFileName: string): Promise<void> => {
    const consoleLoggerFactory: LoggerFactory = container.resolve(ConsoleLoggerFactory);
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
      } catch (e: any) {
        throw new Error(`Can't read "${passwordFile}" file content.`);
      }

      let decryptedEnvFileContent = '';

      try {
        decryptedEnvFileContent = fs.readFileSync(`${rootDirectory}/${envFileName}`, 'utf-8');
      } catch (e: any) {
        throw new Error(`Can't read "${envFileName}" file content.`);
      }

      const ansibleVault = new Vault({ password });
      let encryptedEnvFileContent = '';

      try {
        encryptedEnvFileContent = ansibleVault.encryptSync(decryptedEnvFileContent, '')!;
      } catch (e: any) {
        throw new Error(`Can't decrypt "${envFileName}" file content, following error occured: "${e.message}".`);
      }

      try {
        fs.writeFileSync(envFileName, encryptedEnvFileContent);
      } catch (e: any) {
        throw new Error(`Can't write content to file "${envFileName}".`);
      }
    } catch (err: any) {
      await consoleLogger.error(err);
    }
  };
}

import chalk from 'chalk';

import EasCommand from '../../commandUtils/EasCommand';
import Log from '../../log';
import { getExpoConfig } from '../../project/expoConfig';
import {
  fetchProjectIdFromServerAsync,
  findProjectRootAsync,
  saveProjectIdToAppConfigAsync,
} from '../../project/projectUtils';

export default class ProjectInit extends EasCommand {
  static description = 'create or link an EAS project';
  static aliases = ['init'];

  async runAsync(): Promise<void> {
    const projectDir = await findProjectRootAsync();
    const exp = getExpoConfig(projectDir);

    if (exp.extra?.eas?.projectId) {
      Log.error(
        `app.json is already linked to project with ID: ${chalk.bold(exp.extra?.eas?.projectId)}`
      );
      return;
    }

    const projectId = await fetchProjectIdFromServerAsync(exp);
    await saveProjectIdToAppConfigAsync(projectDir, projectId);

    Log.withTick(`Linked app.json to project with ID ${chalk.bold(projectId)}`);
  }
}

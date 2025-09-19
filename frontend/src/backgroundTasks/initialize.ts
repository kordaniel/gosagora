import {
  type LocationTaskExecutorBody,
  bgLocationTaskExecutor,
} from '../modules/location';
import taskManager, { BG_TASK } from './taskManager';
import config from '../utils/config';

export const defineBackgroundTasks = () => {
  if (config.IS_MOBILE) {
    if (!taskManager.isTaskDefined(BG_TASK.Location)) {
      taskManager.defineTask<LocationTaskExecutorBody>(BG_TASK.Location, bgLocationTaskExecutor);
    }
  }
};

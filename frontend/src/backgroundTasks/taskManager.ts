import * as TaskManager from 'expo-task-manager';

export enum BG_TASK {
  Location = 'gosagora-bg-task-location',
}

export type LocationTaskExecutorType<T> = TaskManager.TaskManagerTaskExecutor<T>;

const defineTask = <T>(
  taskName: BG_TASK,
  taskExecutor: TaskManager.TaskManagerTaskExecutor<T>
) => {
  TaskManager.defineTask(taskName, taskExecutor);
};

const isTaskDefined = (taskName: BG_TASK) => {
  return TaskManager.isTaskDefined(taskName);
};

const isTaskRegistered = async (taskName: BG_TASK) => {
  return await TaskManager.isTaskRegisteredAsync(taskName);
};

export default {
  defineTask,
  isTaskDefined,
  isTaskRegistered,
};

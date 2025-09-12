import * as TaskManager from 'expo-task-manager';

export enum BG_TASK {
  Location = 'gosagora-bg-task-location',
}

export type LocationTaskExecutorType<T> = TaskManager.TaskManagerTaskExecutor<T>;

const defineTask = <T>(
  taskName: BG_TASK,
  taskExecutor: TaskManager.TaskManagerTaskExecutor<T>
) => {
  console.log('defining TASK, name:', taskName, 'executor:', taskExecutor);
  TaskManager.defineTask(taskName, taskExecutor);
};

const isTaskDefined = (taskName: BG_TASK) => {
  const wasDefined = TaskManager.isTaskDefined(taskName);
  console.log('task:', taskName, 'was defined:', wasDefined);
  return wasDefined;
};

const isTaskRegistered = async (taskName: BG_TASK) => {
  const wasRegistered = await TaskManager.isTaskRegisteredAsync(taskName);
  console.log('task:', taskName, 'was registered:', wasRegistered);
  return wasRegistered;
};

export default {
  defineTask,
  isTaskDefined,
  isTaskRegistered,
};

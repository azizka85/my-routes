export enum TaskStatus {
  error,
  completed
}

export interface TaskData {
  status: TaskStatus;
  data?: any
}

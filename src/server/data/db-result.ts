export enum DBResultStatus {
  OK = 'OK',
  Error = 'Error'
}

export interface DBResult {
  status: DBResultStatus;
  data?: any;
}

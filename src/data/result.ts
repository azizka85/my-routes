export enum ResultStatus {
  OK = 'OK',
  Error = 'Error'
}

export interface Result {
  status: ResultStatus;
  data?: any;
}

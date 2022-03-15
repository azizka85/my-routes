import { IncomingMessage, ServerResponse } from 'http';

export interface RouteState {
  request: IncomingMessage;
  response: ServerResponse;
  session: any;
}

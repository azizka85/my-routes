import { IncomingMessage, ServerResponse } from 'http';

import { Session } from './session';

export interface RouteState {
  request: IncomingMessage;
  response: ServerResponse;
  session: Session;
}

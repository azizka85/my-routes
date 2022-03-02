import app from '../../server/app';

import { ResponseMock } from './response-mock';

import { RouteState } from '../../server/data/route-state';

import { fragment, query } from '../../server/helpers';

export async function fetchMock(url: string) {
  const state = ({
    request: {},
    response: new ResponseMock()
  } as unknown) as RouteState;

  const splits = url.split('?');

  const currentPath = fragment(splits[0], app.rootPath);
  const currentQuery = query(splits[1]);

  await app.processUrl(currentPath, currentQuery, state);

  return state.response;
}

import { createServer } from 'http';

import app from './app';

import { RouteState } from './data/route-state';

import { fragment, query, generateId, parseCookies, setCookie } from './helpers';
import { clearExpiredSessions, getSession, setSession } from './helpers/session-helpers';

const port = parseInt(process.env.PORT || '3000');

const server = createServer(async (req, res) => {
  await clearExpiredSessions();
  
  const cookies = parseCookies(req);
  const sessionId = cookies.sessionId || generateId();

  const state: RouteState = {
    request: req,
    response: res,
    session: await getSession(sessionId)
  };

  setCookie(res, 'sessionId', sessionId, {
    'Max-Age': `${24*3600}`,
    'Path': '/'
  });

  const splits = req.url?.split('?') || [];

  const currentPath = fragment(splits[0], app.rootPath);
  const currentQuery = query(splits[1]);

  app
    .processUrl(currentPath, currentQuery, state)
    .catch(err => {
      res.statusCode = 500;
      console.error(err);
    })
    .finally(async () => {
      res.end();

      await setSession(state.session);
    }); 
});

server.listen(port, undefined, undefined, () => {
  console.log(`Server listening on port ${port}`);
});

export default server;

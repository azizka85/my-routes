import { createServer } from 'http';

import app from './app';

import { RouteState } from './data/route-state';

import { fragment, query } from './helpers';

const port = parseInt(process.env.PORT || '3000');

const server = createServer((req, res) => {
  const state: RouteState = {
    request: req,
    response: res
  };

  const splits = req.url?.split('?') || [];

  const currentPath = fragment(splits[0], app.rootPath);
  const currentQuery = query(splits[1]);

  app
    .processUrl(currentPath, currentQuery, state)
    .catch(err => {
      res.statusCode = 500;
      console.error(err);
    })
    .finally(() => res.end()); 
});

server.listen(port, undefined, undefined, () => {
  console.log(`Server listening on port ${port}`);
});

export default server;

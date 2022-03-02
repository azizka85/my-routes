import { join } from 'path';

import { Router } from '@azizka/router';

import { RouteOptions } from './data/route-options';
import { RouteState } from './data/route-state';

import homeRoutes from './home/routes';

import signInRoutes from './sign-in/routes';
import signUpRoutes from './sign-up/routes';

import authRoutes from './auth/routes';

import { checkStaticResponse } from './helpers';

import { PAGE_ROOT } from '../globals';

import './init-environment';

const app = new Router<RouteOptions, RouteState>({
  root: PAGE_ROOT,
  async page404(page) {
    if(page.state) {
      page.state.response.statusCode = 404;
      page.state.response.setHeader('Content-Type', 'text/html;charset=UTF-8');
      page.state.response.write(`${page.state.request.method} ${page.state.request.url} not found`);
    }
  },
  async before(page) {
    if(page.state) {
      const path = join(
        process.cwd(),
        'public',
        page.fragment
      );

      return checkStaticResponse(page, path);
    }

    return false;
  }
});

app.addRoutes(homeRoutes);

app.addRoutes(signInRoutes);
app.addRoutes(signUpRoutes);

app.addRoutes(authRoutes);

export default app;

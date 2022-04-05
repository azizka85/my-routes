import { Page } from "@azizka/router";

import { RouteOptions } from "../data/route-options";
import { RouteState } from "../data/route-state";
import { Result, ResultStatus } from '../../data/result';

import github from "./handlers/github";

export default [{
  rule: 'auth/service/(:word)',
  async handler(page: Page<RouteOptions, RouteState>) {
    if(page.state) {
      const name = page.match?.[0];

      switch(name) {
        case 'github': 
          github.service(page);
          break;
      }
    }
  }
}, {
  rule: 'auth/callback/(:word)',
  async handler(page: Page<RouteOptions, RouteState>) {
    if(page.state) {
      const name = page.match?.[0];

      switch(name) {
        case 'github': 
          await github.callback(page);
          break;
      }
    }
  }
}, {
  rule: 'auth/sign-out',
  async handler(page: Page<RouteOptions, RouteState>) {
    if(page.state) {
      page.state.session.userId = null;

      if(page.state.session.service) {
        switch(page.state.session.service) {
          case 'github':
            delete page.state.session.data.oauthGithub;
            break;
        }
      }

      page.state.session.service = null;

      if(page.query.ajax) {
        page.state.response.statusCode = 200;
        page.state.response.setHeader('Content-Type', 'application/json;charset=UTF-8');
        page.state.response.write(JSON.stringify({
          status: ResultStatus.OK
        } as Result));
      } else {
        const redirect = page.query.redirect;

        page.state.response.statusCode = 302;
      
        if(redirect) {
          page.state.response.setHeader(
            'location',
            encodeURI(redirect)
          );
        } else {
          page.state.response.setHeader(
            'location',
            '/'
          );
        }
      }
    }
  }
}];

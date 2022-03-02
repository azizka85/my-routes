import { Page } from "@azizka/router";

import { RouteOptions } from "../data/route-options";
import { RouteState } from "../data/route-state";

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
}];

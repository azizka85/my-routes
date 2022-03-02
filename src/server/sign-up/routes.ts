import signUpPage from "../templates/pages/sign-up-page";

import authServiceComponent from "../templates/components/auth-service-component";

import { Page } from "@azizka/router";

import { RouteOptions } from "../data/route-options";
import { RouteState } from "../data/route-state";

import { renderPage } from '../helpers/layout-helpers';

import { localeRoute } from '../../helpers';

import { DEFAULT_LANGUAGE, PAGE_ROOT } from '../../globals';

import { version } from '../../../package.json';

export default [{
  rule: `${localeRoute}/?sign-up`,
  async handler(page: Page<RouteOptions, RouteState>) {
    if(page.state) {
      const lang = page.match?.[0] || DEFAULT_LANGUAGE; 
      
      const data = {};

      if(page.query.ajax && !page.query.init) {
        page.state.response.setHeader('Content-Type', 'application/json;charset=UTF-8');
        page.state.response.write(JSON.stringify(data));        
      } else {
        page.state.response.setHeader('Content-Type', 'text/html;charset=UTF-8');

        page.state.response.write(
          renderPage(
            lang, 
            PAGE_ROOT, 
            version, 
            page, 
            'sign-up-page', 
            signUpPage, 
            data,
            undefined,
            {
              'auth-service-component': authServiceComponent
            }            
          )
        );        
      }      
    }
  }
}];

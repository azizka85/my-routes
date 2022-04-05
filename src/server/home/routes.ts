import { Page } from "@azizka/router";

import { RouteOptions } from "../data/route-options";
import { RouteState } from "../data/route-state";

import homePage from "../templates/pages/home-page";

import { renderPage, stringToArray, getLayoutHandlers } from '../helpers/layout-helpers';
import { getUserInfoFromSession } from '../helpers/user-helpers';

import { localeRoute } from '../../helpers';

import { DEFAULT_LANGUAGE, PAGE_ROOT } from '../../globals';

import { version } from '../../../package.json';

export default [{
  rule: `${localeRoute}/?`,
  async handler(page: Page<RouteOptions, RouteState>) {
    if(page.state) {
      const lang = page.match?.[0] || DEFAULT_LANGUAGE;  
      const user = await getUserInfoFromSession(page.state.session);  

      const data = {
        time: Date.now()
      };

      if(page.query.ajax && !page.query.init) {
        page.state.response.setHeader('Content-Type', 'application/json;charset=UTF-8');
        page.state.response.write(JSON.stringify(data));        
      } else {
        const layouts = !page.query.ajax
          ? ['main-layout']
          : stringToArray(page.query.layouts);

        const layoutHandlers = getLayoutHandlers(layouts);

        page.state.response.setHeader('Content-Type', 'text/html;charset=UTF-8');

        page.state.response.write(
          renderPage(
            lang, 
            PAGE_ROOT, 
            version, 
            page, 
            'home-page', 
            homePage, 
            data,
            layoutHandlers,
            user
          )
        );        
      }   
    }
  }
}];

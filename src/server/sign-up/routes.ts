import signUpPage from "../templates/pages/sign-up-page";

import authServiceComponent from "../templates/components/auth-service-component";

import { Page } from "@azizka/router";

import { RouteOptions } from "../data/route-options";
import { RouteState } from "../data/route-state";
import { User } from "../../data/user";

import { renderPage } from '../helpers/layout-helpers';
import { signUp } from "../helpers/user-helpers";
import { getRequestData } from "../helpers";
import { localeRoute } from '../../helpers';

import { DEFAULT_LANGUAGE, PAGE_ROOT } from '../../globals';

import { version } from '../../../package.json';
import { ResultStatus } from "../../data/result";

export default [{
  rule: `${localeRoute}/?sign-up`,
  async handler(page: Page<RouteOptions, RouteState>) {
    if(page.state) {
      const lang = page.match?.[0] || DEFAULT_LANGUAGE; 

      if(page.state.request.method === 'POST') {
        const postData = await getRequestData(page.state.request) as User;

        const result = await signUp(
          postData,
          lang,
          page.state.session
        );

        if(page.query.ajax) {
          page.state.response.setHeader('Content-Type', 'application/json;charset=UTF-8');          
          page.state.response.write(JSON.stringify(result));  
        } else {
          page.state.response.statusCode = 302;

          if(result.status === ResultStatus.OK) {
            page.state.response.setHeader(
              'location',
              encodeURI(lang === DEFAULT_LANGUAGE ? '/' : `/${lang}/`)
            );
          } else {            
            page.state.response.setHeader(
              'location', 
              encodeURI((lang === DEFAULT_LANGUAGE ? '/sign-up' : `/${lang}/sign-up`) + `?error=${result.data}`)
            );
          }
        }
      } else {
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
  }
}];

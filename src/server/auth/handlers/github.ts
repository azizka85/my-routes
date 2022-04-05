import { request } from 'https';

import { Page } from '@azizka/router';
import { Translator } from "@azizka/i18n";

import { RouteOptions } from '../../data/route-options';
import { RouteState } from '../../data/route-state';
import { OAuthServiceRequestState } from '../../data/oauth-service-request-state';

import locales from '../../helpers/locale-helpers';
import { getUserIdByEmail } from '../../helpers/user-helpers';
import { getRequestData } from '../../helpers';
import { getQueryParameters } from '../../../helpers';

import { DEFAULT_LANGUAGE } from '../../../globals';

const githubAuthorizeUrl = 'https://github.com/login/oauth/authorize';

export default {
  service(page: Page<RouteOptions, RouteState>) {
    if(page.state) {
      const params: {
        [key: string]: string
      } = {
        client_id: process.env.GITHUB_CLIENT_ID || ''
      };

      const state: OAuthServiceRequestState = {};
  
      if(page.query.lang) {
        state.lang = page.query.lang;
      }

      if(page.query.ajax) {
        state.ajax = page.query.ajax;
      }

      params.state = JSON.stringify(state);
  
      const url = `${githubAuthorizeUrl}?${getQueryParameters(params)}`;
  
      page.state.response.statusCode = 302;
      page.state.response.setHeader('location', encodeURI(url));
    }
  },

  async callback(page: Page<RouteOptions, RouteState>) {
    if(page.state) {
      let state: OAuthServiceRequestState = {};

      try {
        state = JSON.parse(page.query.state);
      } catch {}

      const lang = state.lang ?? DEFAULT_LANGUAGE;
      const ajax = !!state.ajax;

      const translator = lang in locales ? locales[lang] : new Translator();

      const params = JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: page.query.code
      });

      const responseData = await new Promise(resolve => {
        const req = request({
          hostname: 'github.com',
          path: '/login/oauth/access_token',
          method: 'POST',        
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': params.length,
            accept: 'application/json'
          }
        }, async (res) => {
          let data = {};

          try {
            data = JSON.parse(await getRequestData(res));
          } catch {}

          resolve(data);
        });

        req.on('error', err => resolve(err));

        req.write(params);
        req.end();
      }) as any;
      
      const result = {
        ...responseData
      };      

      if(responseData.access_token) {
        const userData = await new Promise(resolve => {
          const req = request({
            hostname: 'api.github.com',
            path: '/user',
            method: 'GET',
            headers: {
              'User-Agent': page.state?.request.headers['user-agent'] || '',
              Authorization: `token ${responseData.access_token}`
            }
          }, async (res) => {
            let data = {};

            try {
              data = JSON.parse(await getRequestData(res));
            } catch {}

            resolve(data);
          });

          req.on('error', err => resolve(err));

          req.end();
        }) as any;

        result['user'] = userData;      

        page.state.session.userId = await getUserIdByEmail(userData.email) ?? null;
        page.state.session.service = 'github';
        page.state.session.data = {
          ...page.state.session.data,
          oauthGithub: result
        };

        if(ajax) {
          page.state.response.setHeader('Content-Type', 'application/json;charset=UTF-8');
          page.state.response.write(JSON.stringify(result));
        } else {
          page.state.response.statusCode = 302;
          
          if(!page.state.session.userId) {
            page.state.response.setHeader(
              'location',
              encodeURI(
                (lang === DEFAULT_LANGUAGE ? '/sign-up' : `/${lang}/sign-up`) + 
                `?warning=${translator.translate('To link with this OAuth account need to Sign Up')}`
              )
            );
          } else {
            page.state.response.setHeader(
              'location', 
              encodeURI(lang === DEFAULT_LANGUAGE ? '/' : `/${lang}/`)
            );
          }
        }
      } else {
        if(ajax) {
          page.state.response.setHeader('Content-Type', 'application/json;charset=UTF-8');
          page.state.response.write(JSON.stringify(result));
        } else {
          page.state.response.statusCode = 302;
          page.state.response.setHeader(
            'location', 
            encodeURI(
              (lang === DEFAULT_LANGUAGE ? '/sign-in' : `/${lang}/sign-in`) + 
              `?error=${translator.translate('Could not to Sign In with this OAuth service')}`
            )
          );
        }
      }
    }
  }
};

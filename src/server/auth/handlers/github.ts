import { request } from 'https';

import { Page } from '@azizka/router';

import { RouteOptions } from '../../data/route-options';
import { RouteState } from '../../data/route-state';

import { getQueryParameters } from '../../../helpers';

const githubAuthorizeUrl = 'https://github.com/login/oauth/authorize';

export default {
  service(page: Page<RouteOptions, RouteState>) {
    if(page.state) {
      const params: {
        [key: string]: string
      } = {
        client_id: process.env.GITHUB_CLIENT_ID || ''
      };
  
      if(page.query.lang) {
        params.state = page.query.lang;
      }
  
      const url = `${githubAuthorizeUrl}?${getQueryParameters(params)}`;
  
      page.state.response.statusCode = 302;
      page.state.response.setHeader('location', encodeURI(url));
    }
  },

  async callback(page: Page<RouteOptions, RouteState>) {
    if(page.state) {
      const lang = page.query.state || '';

      const params = JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: page.query.code
      });

      const responseData = await new Promise(resolve => {
        const buffer: any[] = [];

        const req = request({
          hostname: 'github.com',
          path: '/login/oauth/access_token',
          method: 'POST',        
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': params.length,
            accept: 'application/json'
          }
        }, res => {
          res.on('data', chunk => buffer.push(chunk));

          res.on('end', () => {
            let data = {};

            try {
              data = JSON.parse(Buffer.concat(buffer).toString());            
            } catch {}          

            resolve(data);
          });
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
          const buffer: any[] = [];

          const req = request({
            hostname: 'api.github.com',
            path: '/user',
            method: 'GET',
            headers: {
              'User-Agent': page.state?.request.headers['user-agent'] || '',
              Authorization: `token ${responseData.access_token}`
            }
          }, res => {
            res.on('data', chunk => buffer.push(chunk));

            res.on('end', () => {
              let data = {};
    
              try {
                data = JSON.parse(Buffer.concat(buffer).toString());            
              } catch {}            
    
              resolve(data);
            });
          });

          req.on('error', err => resolve(err));

          req.end();
        });

        result['user'] = userData;      
      } else {
        
      }

      page.state.response.setHeader('Content-Type', 'application/json;charset=UTF-8');
      page.state.response.write(JSON.stringify(result));
    }
  }
};

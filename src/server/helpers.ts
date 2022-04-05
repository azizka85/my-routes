import { lstatSync, readFileSync } from 'fs';
import { URLSearchParams } from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import { randomBytes } from 'crypto';

import { trimSlashes, parseQuery, Page } from '@azizka/router';

import { RouteOptions } from './data/route-options';
import { RouteState } from './data/route-state';
import { CookieOptions } from './data/cookie-options';

import { groupParamsByKey } from '../helpers';

export function fragment(path: string, root: string) {
  let value = decodeURI(path);

  if(root !== '/') {
    value = value.replace(root, '');
  }

  return trimSlashes(value);
}

export function query(search: string) {
  if(search) {
    return parseQuery(search);
  }

  return {};
}

export async function checkStaticResponse(page: Page<RouteOptions, RouteState>, path: string) {
  if(page.state) {
    try {
      const stat = lstatSync(path);

      if(stat.isFile()) {
        const data = readFileSync(path);

        if(path.endsWith('.js')) {
          page.state.response.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        } else if(path.endsWith('.svg')) {
          page.state.response.setHeader('Content-Type', 'image/svg+xml');
        } else if(path.endsWith('.png')) {
          page.state.response.setHeader('Content-Type', 'image/png');
        } else if(path.endsWith('.css')) {
          page.state.response.setHeader('Content-Type', 'text/css; charset=UTF-8');
        }

        page.state.response.write(data);

        return true;
      }
    } catch {}
  }

  return false;
}

export async function getRequestData(request: IncomingMessage) {
  const chunks = [];

  for await(const chunk of request) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString();  
}

export async function getUrlData(request: IncomingMessage) {
  const data = await getRequestData(request);

  return groupParamsByKey(new URLSearchParams(data));
}

export function generateId() {
  return randomBytes(48).toString('hex');
}

export function parseCookies(request: IncomingMessage) {
  const data: {
    [key: string]: string
  } = {};

  request.headers.cookie?.split(';').forEach(item => {
    const parts = item.split('=');

    const key = parts.shift()?.trim();

    if(key) {
      data[key] = decodeURI(parts.join('='));
    }
  });

  return data;
}

export function setCookie(
  res: ServerResponse, 
  name: string,
  value: string,
  options?: CookieOptions
) {
  try {
    const chunks = [`${name}=${encodeURI(value)}`];

    if(options) {
      for(const key of Object.keys(options)) {
        if(options[key] !== null) {
          chunks.push(`${key}=${options[key]}`);
        } else {
          chunks.push(key);
        }
      }
    }

    const cookies = res.getHeader('Set-Cookie') as string[] || [];
  
    cookies.push(chunks.join('; '));

    res.setHeader('Set-Cookie', cookies);
  } catch(err) {
    console.error(err);    
  }
}

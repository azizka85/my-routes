import { lstatSync, readFileSync } from 'fs';
import { IncomingMessage } from 'http';

import { trimSlashes, parseQuery, Page } from '@azizka/router';

import { RouteOptions } from './data/route-options';
import { RouteState } from './data/route-state';

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

  const data = Buffer.concat(chunks).toString();

  return JSON.parse(data);
}

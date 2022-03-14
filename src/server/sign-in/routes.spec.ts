import app from '../app';

import { RouteState } from '../data/route-state';

describe('sign-in routes test', () => {
  test('should load page "/sign-in" correctly', async () => {
    let contentType;
    let contentExist = false;

    const state = ({
      request: {
        method: 'GET'
      },
      response: {
        statusCode: 200,
        setHeader(name: string, value: string) {
          if(name === 'Content-Type') {
            contentType = value;
          }
        },
        write() {
          contentExist = true;
        }
      }
    } as unknown) as RouteState;

    await app.processUrl('sign-in', {}, state);

    expect(state.response.statusCode).toEqual(200);
    expect(contentExist).toBeTruthy();
    expect(contentType).toEqual('text/html;charset=UTF-8');
  });

  test('should load page "/ru/sign-in" correctly', async () => {
    let contentType;
    let contentExist = false;

    const state = ({
      request: {
        method: 'GET'
      },
      response: {
        statusCode: 200,
        setHeader(name: string, value: string) {
          if(name === 'Content-Type') {
            contentType = value;
          }
        },
        write() {
          contentExist = true;
        }
      }
    } as unknown) as RouteState;

    await app.processUrl('ru/sign-in', {}, state);

    expect(state.response.statusCode).toEqual(200);
    expect(contentExist).toBeTruthy();
    expect(contentType).toEqual('text/html;charset=UTF-8');
  });

  test('should load data from "/sign-in" correctly', async () => {
    let contentType;
    let contentExist = false;

    const state = ({
      request: {
        method: 'GET'
      },
      response: {
        statusCode: 200,
        setHeader(name: string, value: string) {
          if(name === 'Content-Type') {
            contentType = value;
          }
        },
        write() {
          contentExist = true;
        }
      }
    } as unknown) as RouteState;

    await app.processUrl('sign-in', { ajax: '1' }, state);

    expect(state.response.statusCode).toEqual(200);
    expect(contentExist).toBeTruthy();
    expect(contentType).toEqual('application/json;charset=UTF-8');
  });
});

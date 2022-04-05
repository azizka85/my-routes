import app from '../app';

import knex from "../db/knex";

import { RouteState } from '../data/route-state';
import { ResultStatus } from '../../data/result';

jest.mock('../helpers', () => {
  const originalModule = jest.requireActual('../helpers');

  return {
    __esModule: true,
    ...originalModule,
    getUrlData: (request: any) => {
      if(request.correctUser) {
        return {
          fullName: 'Aziz Kudaikulov',
          email: 'aziz.kudaikulov@mail.ru',
          password: 'lock',
          photo: ''        
        };
      } else {
        return {
          fullName: 'Aziz Kudaikulov',
          email: 'aziz.kudaikulov@gmail.com',
          password: 'lock',
          photo: ''        
        };
      }
    }
  }
});

describe('sign-up routes test', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex.seed.run();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  test('should load page "/sign-up" correctly', async () => {
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

    await app.processUrl('sign-up', {}, state);

    expect(state.response.statusCode).toEqual(200);
    expect(contentExist).toBeTruthy();
    expect(contentType).toEqual('text/html;charset=UTF-8');
  });

  test('should load page "/ru/sign-up" correctly', async () => {
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

    await app.processUrl('ru/sign-up', {}, state);

    expect(state.response.statusCode).toEqual(200);
    expect(contentExist).toBeTruthy();
    expect(contentType).toEqual('text/html;charset=UTF-8');
  });

  test('should load data from "/sign-up" correctly', async () => {
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

    await app.processUrl('sign-up', { ajax: '1' }, state);

    expect(state.response.statusCode).toEqual(200);
    expect(contentExist).toBeTruthy();
    expect(contentType).toEqual('application/json;charset=UTF-8');
  });

  test('should correctly process sign-up using post data', async () => {
    let location = '';

    const state = {
      request: {
        method: 'POST',
        correctUser: true      
      },
      response: {
        statusCode: 200,
        setHeader(name: string, value: string) {
          if(name === 'location') {
            location = value;
          }
        }
      },
      session: {}
    };

    await app.processUrl('sign-up', {}, (state as unknown) as RouteState);

    expect(state.response.statusCode).toEqual(302);
    expect(location).toEqual('sign-up');
  });

  test('should correctly process sign-up using post data with ajax', async () => {
    let contentType = '';
    let correctProcessed = false;

    const state = {
      request: {
        method: 'POST',
        correctUser: true       
      },
      response: {
        statusCode: 200,
        setHeader(name: string, value: string) {
          if(name === 'Content-Type') {
            contentType = value;
          }
        },
        write(data: string) {
          try {
            const result = JSON.parse(data);

            correctProcessed = result.status === ResultStatus.OK;
          } catch { }
        }
      },
      session: {}
    };

    await app.processUrl('sign-up', { ajax: '1' }, (state as unknown) as RouteState);

    expect(state.response.statusCode).toEqual(200);
    expect(correctProcessed).toBeTruthy();
    expect(contentType).toEqual('application/json;charset=UTF-8');

    state.request.correctUser = false;

    await app.processUrl('sign-up', { ajax: '1' }, (state as unknown) as RouteState);

    expect(state.response.statusCode).toEqual(200);
    expect(correctProcessed).toBeFalsy();
    expect(contentType).toEqual('application/json;charset=UTF-8');
  });
});

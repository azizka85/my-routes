import { JSDOM } from 'jsdom';

import { LocationMock } from '@azizka/router';

import { SignUpPage } from './sign-up-page';

import { fetchMock } from '../../mocks/fetch-mock';

import locales from '../../../server/helpers/locale-helpers';

import { context } from '../../globals';
import { DEFAULT_LANGUAGE } from '../../../globals';

describe('SignUpPage test', () => {
  beforeEach(() => {
    const dom = new JSDOM();

    global.window = (dom.window as unknown) as Window & typeof globalThis; 
    global.document = dom.window.document;
  
    global.location = (new LocationMock() as unknown) as Location;
    
    location.pathname = '/ru/sign-up';
    location.search = '';  
  
    global.HTMLElement = dom.window.HTMLElement;
  
    global.fetch = req => (fetchMock((req as unknown) as string) as unknown) as Promise<Response>;
  });

  test('Should get single instance of SignUpPage', async () => {
    const instance = SignUpPage.instance;

    expect(instance).toBeTruthy();
    expect(instance).toBeInstanceOf(SignUpPage);
    expect(instance).toBe(SignUpPage.instance);

    expect(instance['node']).toBeFalsy();

    expect(instance['titleElem']).toBeFalsy();

    expect(instance['nameLabelElem']).toBeFalsy();
    expect(instance['passwordLabelElem']).toBeFalsy();

    expect(instance['signInBtn']).toBeFalsy();
    expect(instance['signUpBtn']).toBeFalsy();
    expect(instance['cancelBtn']).toBeFalsy();

    expect(instance['authService']).toBeFalsy();
  });

  test('Should load content via fetch content data', async () => {
    const pageInstance = SignUpPage.instance;

    await pageInstance.init(null, false);

    context.tr = locales[DEFAULT_LANGUAGE].translate.bind(locales[DEFAULT_LANGUAGE]);;

    await pageInstance.load('ru', {
      fragment: '',
      query: {},
      match: [],
      options: {}
    }, true);

    expect(pageInstance['node']).toBeTruthy();
    expect(pageInstance['node']).toBeInstanceOf(HTMLElement);
    expect(pageInstance['node']?.getAttribute('data-page')).toEqual('signup-page');

    expect(pageInstance['titleElem']).toBeTruthy();
    expect(pageInstance['titleElem']).toBeInstanceOf(HTMLElement);
    expect(pageInstance['titleElem']?.textContent).toContain(context.tr('Sign Up'));

    expect(pageInstance['nameLabelElem']).toBeTruthy();
    expect(pageInstance['nameLabelElem']).toBeInstanceOf(HTMLElement);
    expect(pageInstance['nameLabelElem']?.textContent).toContain(context.tr('Name'));

    expect(pageInstance['passwordLabelElem']).toBeTruthy();
    expect(pageInstance['passwordLabelElem']).toBeInstanceOf(HTMLElement);
    expect(pageInstance['passwordLabelElem']?.textContent).toContain(context.tr('Password'));

    expect(pageInstance['signInBtn']).toBeTruthy();
    expect(pageInstance['signInBtn']).toBeInstanceOf(HTMLElement);
    expect(pageInstance['signInBtn']?.getAttribute('data-button')).toEqual('sign-in');
    expect(pageInstance['signInBtn']?.getAttribute('href')).toEqual('/ru/sign-in');
    expect(pageInstance['signInBtn']?.textContent).toContain(context.tr('Sign In'));    

    expect(pageInstance['signUpBtn']).toBeTruthy();
    expect(pageInstance['signUpBtn']).toBeInstanceOf(HTMLElement);
    expect(pageInstance['signUpBtn']?.getAttribute('data-button')).toEqual('sign-up');
    expect(pageInstance['signUpBtn']?.textContent).toContain(context.tr('Sign Up'));    

    expect(pageInstance['cancelBtn']).toBeTruthy();
    expect(pageInstance['cancelBtn']).toBeInstanceOf(HTMLElement);
    expect(pageInstance['cancelBtn']?.getAttribute('data-button')).toEqual('cancel');
    expect(pageInstance['cancelBtn']?.getAttribute('href')).toEqual('/ru/');
    expect(pageInstance['cancelBtn']?.textContent).toContain(context.tr('Cancel'));

    expect(pageInstance['authService']).toBeTruthy();
  });
});

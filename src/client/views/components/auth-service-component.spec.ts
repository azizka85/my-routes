import { JSDOM } from 'jsdom';

import { LocationMock } from '@azizka/router';

import { SignInPage } from '../pages/sign-in-page';
import { AuthServiceComponent } from './auth-service-component';

import { fetchMock } from '../../mocks/fetch-mock';

import locales from '../../../server/helpers/locale-helpers';

import { context } from '../../globals';
import { DEFAULT_LANGUAGE } from '../../../globals';

describe('AuthServiceComponent test', () => {
  beforeEach(() => {
    const dom = new JSDOM();

    global.window = dom.window;
    global.document = dom.window.document;
  
    global.location = new LocationMock();
    
    location.pathname = '/ru/sign-in';
    location.search = '';  
  
    global.HTMLElement = dom.window.HTMLElement;
  
    global.fetch = req => fetchMock(req);
  });

  test('Should load content via fetch content data', async () => {
    const pageInstance = SignInPage.instance;

    await pageInstance.init(null, false);

    context.tr = locales[DEFAULT_LANGUAGE].translate.bind(locales[DEFAULT_LANGUAGE]);;

    await pageInstance.load('ru', {
      fragment: '',
      query: {},
      match: [],
      options: {}
    }, true);

    const component = SignInPage.instance['authService']	;
		
		expect(component).toBeTruthy();
		expect(component).toBeInstanceOf(AuthServiceComponent);

		expect(component?.['titleElem']).toBeTruthy();
		expect(component?.['titleElem']).toBeInstanceOf(HTMLElement);
		expect(component?.['titleElem']?.getAttribute('data-title')).toEqual('auth-service');
		expect(component?.['titleElem']?.textContent).toContain(context.tr('Or use the service'));		

		expect(component?.['githubBtn']).toBeTruthy();
		expect(component?.['githubBtn']).toBeInstanceOf(HTMLElement);
		expect(component?.['githubBtn']?.getAttribute('data-button')).toEqual('auth-service-github');
		expect(component?.['githubBtn']?.title).toEqual('GitHub');		

		await SignInPage.instance.load('ru', {
			fragment: '',
			match: [],
			options: {},
			query: {}
		}, false);

		expect(component?.['titleElem']?.textContent).toContain(context.tr('Or use the service'));
  });
});

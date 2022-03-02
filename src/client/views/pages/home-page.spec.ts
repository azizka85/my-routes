import { JSDOM } from 'jsdom';

import { LocationMock } from '@azizka/router';

import { HomePage } from './home-page';
import { MainLayout } from '../layouts/main-layout';

import { fetchMock } from '../../mocks/fetch-mock';

import { layouts, views } from '../../globals';
import { DEFAULT_LANGUAGE } from '../../../globals';

describe('HomePage test', () => {
  beforeEach(() => {
    const dom = new JSDOM();

    global.window = dom.window;
    global.document = dom.window.document;

    global.location = new LocationMock();
    
    location.pathname = '/';
    location.search = '';  

    global.HTMLElement = dom.window.HTMLElement;

    global.Event = document.defaultView.Event;
    global.CustomEvent = document.defaultView.CustomEvent;

    global.fetch = req => fetchMock(req);

    window.scrollTo = options => {
      window.scrollX = typeof options === 'number' ? options : options?.left || 0;
      window.scrollY = typeof options === 'number' ? options : options?.top || 0;
    };
  });

  test('Should get single instance of HomePage', () => {
    const instance = HomePage.instance;
  
    expect(instance).toBeTruthy();
    expect(instance).toBeInstanceOf(HomePage);
    expect(instance).toBe(HomePage.instance);

    expect(instance['node']).toBeFalsy();

    expect(instance['scrollTopBtn']).toBeFalsy();

    expect(instance['currScroll']).toEqual(0);
  });

  test('Should load content via fetch content data', async () => {
    const layoutInstance = MainLayout.instance;
    const pageInstance = HomePage.instance;

    const content = await pageInstance.init(null, false);
    await layoutInstance.init(content, false);

    expect(pageInstance['node']).toBeTruthy();
    expect(pageInstance['node']).toBeInstanceOf(HTMLElement);
    expect(pageInstance['node']?.getAttribute('data-page')).toEqual('home-page');

    expect(pageInstance['scrollTopBtn']).toBeTruthy();
    expect(pageInstance['scrollTopBtn']).toBeInstanceOf(HTMLElement);
    expect(pageInstance['scrollTopBtn']?.getAttribute('data-button')).toEqual('scroll-top');
    expect(pageInstance['scrollTopBtn']?.classList.contains('btn-exited')).toBeTruthy();

    expect(pageInstance['currScroll']).toEqual(0);
  });

  test('Handlers should work correctly', async () => {   
    const layoutInstance = MainLayout.instance;
    const pageInstance = HomePage.instance;      

    const content = await pageInstance.init(null, false);

    views['home-page'] = pageInstance;    

    await layoutInstance.init(content, false); 
    
    layouts['main-layout'] = layoutInstance;
    
    await layoutInstance.mount();
    await pageInstance.mount();

    await pageInstance.load(DEFAULT_LANGUAGE, {
      fragment: '',
      query: {},
      match: [],
      options: {}
    }, true);

    expect(pageInstance['currScroll']).toEqual(0);
    expect(window.scrollY).toEqual(pageInstance['currScroll']);
    
    expect(pageInstance['scrollTopBtn']?.classList.contains('btn-exited')).toBeTruthy();

    window.scrollTo({
      top: 100
    });

    window.dispatchEvent(new Event('scroll'));

    expect(pageInstance['currScroll']).toEqual(100);
    expect(window.scrollY).toEqual(pageInstance['currScroll']);

    expect(pageInstance['scrollTopBtn']?.classList.contains('btn-exited')).toBeFalsy();

    window.scrollTo({
      top: 0
    });

    expect(pageInstance['currScroll']).toEqual(100);
    expect(window.scrollY).toEqual(0);

    await pageInstance.load(DEFAULT_LANGUAGE, {
      fragment: '',
      query: {},
      match: [],
      options: {}
    }, false);

    expect(pageInstance['currScroll']).toEqual(100);
    expect(window.scrollY).toEqual(pageInstance['currScroll']);

    expect(pageInstance['scrollTopBtn']?.classList.contains('btn-exited')).toBeFalsy();

    window.scrollTo({
      top: 0
    });

    window.dispatchEvent(new Event('scroll'));

    expect(pageInstance['currScroll']).toEqual(0);
    expect(window.scrollY).toEqual(pageInstance['currScroll']);
    
    expect(pageInstance['scrollTopBtn']?.classList.contains('btn-exited')).toBeTruthy();      
  });
});

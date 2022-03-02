import { JSDOM } from 'jsdom';

import { LoaderPage } from './loader-page';

import { fetchMock } from '../../mocks/fetch-mock';

describe('LoaderPage test', () => {
  beforeEach(() => {
    const dom = new JSDOM();

    global.document = dom.window.document;

    global.HTMLElement = dom.window.HTMLElement;    
  });

  test('Should get single instance of HomePage', () => {
    const instance = LoaderPage.instance;
  
    expect(instance).toBeTruthy();
    expect(instance).toBeInstanceOf(LoaderPage);
    expect(instance).toBe(LoaderPage.instance);

    expect(instance['node']).toBeFalsy();    
  });

  test('Should load content via fetch content data', async () => {
    const html = (await fetchMock('/')).text();

    const content = document.createElement('div');
    content.innerHTML = html;    

    const pageInstance = LoaderPage.instance;
    pageInstance.init(content, true);

    expect(pageInstance['node']).toBeTruthy();
    expect(pageInstance['node']).toBeInstanceOf(HTMLElement);
    expect(pageInstance['node']?.getAttribute('data-page')).toEqual('loader-page');
  });
});

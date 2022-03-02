import { JSDOM } from 'jsdom';

import { LocationMock, HistoryMock } from '@azizka/router';

import { MainLayout } from './main-layout';
import { HomePage } from '../pages/home-page';

import { fetchMock } from '../../mocks/fetch-mock';

import locales from '../../../server/helpers/locale-helpers';
import { fragment, query } from '../../../server/helpers';

import { context } from '../../globals';
import { DEFAULT_LANGUAGE } from '../../../globals';

describe('MainLayout test', () => {
  beforeEach(() => {
    const dom = new JSDOM();

    global.window = dom.window;
    global.document = dom.window.document;
  
    global.location = new LocationMock();
    global.history = new HistoryMock(location);

    location.pathname = '/ru';
    location.search = '?main-layout-navigation=1&test=123';
  
    global.HTMLElement = dom.window.HTMLElement;
    global.HTMLFormElement = dom.window.HTMLFormElement;
    global.HTMLInputElement = dom.window.HTMLInputElement;
    global.SVGSVGElement = dom.window.SVGSVGElement;

    global.Event = document.defaultView.Event;
    global.MouseEvent = document.defaultView.MouseEvent;
    global.FocusEvent = document.defaultView.FocusEvent;
    global.CustomEvent = document.defaultView.CustomEvent;
  
    global.fetch = req => fetchMock(req);
  });

  test('Should get single instance of MainLayout', () => {
    const instance = MainLayout.instance;
    
    expect(instance).toBeTruthy();
    expect(instance).toBeInstanceOf(MainLayout);
    expect(instance).toBe(MainLayout.instance);

    expect(instance['node']).toBeFalsy();

    expect(instance['appBarElem']).toBeFalsy();
    expect(instance['drawerElem']).toBeFalsy();

    expect(instance['navIcon']).toBeFalsy();
    expect(instance['searchIcon']).toBeFalsy();

    expect(instance['headerIconElem']).toBeFalsy();
    expect(instance['headerIconBtn']).toBeFalsy();

    expect(instance['signInUpElem']).toBeFalsy();

    expect(instance['list']).toBeFalsy();
    expect(instance['langList']).toBeFalsy();

    expect(instance['langElem']).toBeFalsy();
    expect(instance['langImageElem']).toBeFalsy();

    expect(instance['searchPanel']).toBeFalsy();
    expect(instance['searchForm']).toBeFalsy(); 
    expect(instance['searchInput']).toBeFalsy();  
  });

  test('Should load content via fetch content data', async () => {
    context.tr = locales[DEFAULT_LANGUAGE].translate.bind(locales[DEFAULT_LANGUAGE]);;

    const content = await HomePage.instance.init(null, false);

    const instance = MainLayout.instance;

    await instance.init(content, false);

    await instance.load(
      'ru', 
      {
        fragment: fragment(location.pathname),
        query: query(location.search),
        match: [],
        options: {}
      }, 
      true
    );

    expect(instance['node']).toBeTruthy();
    expect(instance['node']).toBeInstanceOf(HTMLElement);
    expect(instance['node']?.getAttribute('data-layout')).toEqual('main-layout');

    expect(instance['appBarElem']).toBeTruthy();
    expect(instance['appBarElem']).toBeInstanceOf(HTMLElement);
    expect(instance['appBarElem']?.classList.contains('app-bar')).toBeTruthy();
    expect(instance['appBarElem']?.classList.contains('app-bar-hide')).toBeFalsy();
    expect(instance['appBarElem']?.classList.contains('app-bar-scrolled')).toBeFalsy();

    expect(instance['drawerElem']).toBeTruthy();
    expect(instance['drawerElem']).toBeInstanceOf(HTMLElement);
    expect(instance['drawerElem']?.classList.contains('drawer-open')).toBeTruthy();

    expect(instance['navIcon']).toBeTruthy();
    expect(instance['navIcon']).toBeInstanceOf(HTMLElement);
    expect(instance['navIcon']?.getAttribute('data-button')).toEqual('navigation');
    expect(instance['navIcon']?.getAttribute('href')).toEqual('?test=123');

    expect(instance['searchIcon']).toBeTruthy();
    expect(instance['searchIcon']).toBeInstanceOf(HTMLElement);
    expect(instance['searchIcon']?.getAttribute('data-button')).toEqual('search');
    expect(instance['searchIcon']?.getAttribute('href')).toEqual('?main-layout-navigation=1&test=123&main-layout-search=1');

    expect(instance['headerIconElem']).toBeTruthy();
    expect(instance['headerIconElem']).toBeInstanceOf(SVGSVGElement);
    expect(instance['headerIconElem']?.classList.contains('drawer-header-icon-hide')).toBeFalsy();

    expect(instance['headerIconBtn']).toBeTruthy();
    expect(instance['headerIconBtn']).toBeInstanceOf(HTMLElement);
    expect(instance['headerIconBtn']?.getAttribute('data-button')).toEqual('header-navigation');
    expect(instance['headerIconBtn']?.getAttribute('href')).toEqual('?test=123');

    expect(instance['signInUpElem']).toBeTruthy();
    expect(instance['signInUpElem']).toBeInstanceOf(HTMLElement);
    expect(instance['signInUpElem']?.getAttribute('data-content')).toEqual('sign-in-up');
    expect(instance['signInUpElem']?.getAttribute('href')).toEqual('/ru/sign-in');
    expect(instance['signInUpElem']?.textContent).toContain(context.tr('Sign In/Up'));

    expect(instance['list']).toBeTruthy();
    expect(instance['list']).toBeInstanceOf(HTMLElement);
    expect(instance['list']?.children.length).toEqual(3);

    expect(instance['langList']).toBeTruthy();
    expect(instance['langList']).toBeInstanceOf(HTMLElement);
    expect(instance['langList']?.children.length).toEqual(3);

    expect(instance['langElem']).toBeTruthy();
    expect(instance['langElem']).toBeInstanceOf(HTMLElement);
    expect(instance['langElem']?.getAttribute('data-content')).toEqual('lang');

    expect(instance['langImageElem']).toBeTruthy();
    expect(instance['langImageElem']).toBeInstanceOf(HTMLElement);
    expect(instance['langImageElem']?.getAttribute('data-image')).toEqual('lang');

    expect(instance['searchPanel']).toBeTruthy();
    expect(instance['searchPanel']).toBeInstanceOf(HTMLElement);

    expect(instance['searchForm']).toBeTruthy();
    expect(instance['searchForm']).toBeInstanceOf(HTMLFormElement);

    expect(instance['searchInput']).toBeTruthy();
    expect(instance['searchInput']).toBeInstanceOf(HTMLInputElement);
  });

  test('Handlers should work correctly', async () => {  
    context.tr = locales[DEFAULT_LANGUAGE].translate.bind(locales[DEFAULT_LANGUAGE]);;

    const content = await HomePage.instance.init(null, false);

    const instance = MainLayout.instance;

    await instance.init(content, false);

    await instance.mount();

    await instance.load(
      'ru', 
      {
        fragment: fragment(location.pathname),
        query: query(location.search),
        match: [],
        options: {}
      }, 
      true
    );

    window.scrollY = 100;

    window.dispatchEvent(new Event('scroll'));

    expect(instance['appBarElem']?.classList.contains('app-bar-hide')).toBeTruthy();
    expect(instance['appBarElem']?.classList.contains('app-bar-scrolled')).toBeTruthy();

    window.scrollY = 50;

    window.dispatchEvent(new Event('scroll'));

    expect(instance['appBarElem']?.classList.contains('app-bar-hide')).toBeFalsy();
    expect(instance['appBarElem']?.classList.contains('app-bar-scrolled')).toBeTruthy();

    window.scrollY = 0;

    window.dispatchEvent(new Event('scroll'));

    expect(instance['appBarElem']?.classList.contains('app-bar-hide')).toBeFalsy();
    expect(instance['appBarElem']?.classList.contains('app-bar-scrolled')).toBeFalsy();

    instance['navIcon']?.dispatchEvent(new MouseEvent('click'));

    await instance.load(
      'kz', 
      {
        fragment: fragment(location.pathname),
        query: query(location.search),
        match: [],
        options: {}
      }, 
      false
    );

    expect(instance['drawerElem']?.classList.contains('drawer-open')).toBeFalsy();
    expect(instance['navIcon']?.getAttribute('href')).toEqual(`?test=123&main-layout-navigation=1`);
    expect(instance['headerIconElem']?.classList.contains('drawer-header-icon-hide')).toBeTruthy();
    expect(instance['headerIconBtn']?.getAttribute('href')).toEqual(`?test=123&main-layout-navigation=1`);
    expect(instance['searchIcon']?.getAttribute('href')).toEqual(`?test=123&main-layout-search=1`);
    expect(instance['langList']?.children[0].classList.contains('list-item-activated')).toBeTruthy();
    expect(instance['langList']?.children[0].getAttribute('href')).toEqual('/kz?test=123');
    expect(instance['langList']?.children[1].classList.contains('list-item-activated')).toBeFalsy();
    expect(instance['langList']?.children[1].getAttribute('href')).toEqual('/ru?test=123');
    expect(instance['langList']?.children[2].classList.contains('list-item-activated')).toBeFalsy();
    expect(instance['langList']?.children[2].getAttribute('href')).toEqual('/en?test=123');

    instance['searchIcon']?.dispatchEvent(new MouseEvent('click'));

    await instance.load(
      'ru', 
      {
        fragment: fragment(location.pathname),
        query: query(location.search),
        match: [],
        options: {}
      }, 
      false
    );

    expect(instance['navIcon']?.getAttribute('href')).toEqual(`?test=123&main-layout-search=1&main-layout-navigation=1`);
    expect(instance['headerIconBtn']?.getAttribute('href')).toEqual(`?test=123&main-layout-search=1&main-layout-navigation=1`);
    expect(instance['searchIcon']?.getAttribute('href')).toEqual(`?test=123`);
    expect(instance['langList']?.children[0].classList.contains('list-item-activated')).toBeFalsy();
    expect(instance['langList']?.children[0].getAttribute('href')).toEqual('/kz?test=123&main-layout-search=1');
    expect(instance['langList']?.children[1].classList.contains('list-item-activated')).toBeTruthy();
    expect(instance['langList']?.children[1].getAttribute('href')).toEqual('/ru?test=123&main-layout-search=1');
    expect(instance['langList']?.children[2].classList.contains('list-item-activated')).toBeFalsy();
    expect(instance['langList']?.children[2].getAttribute('href')).toEqual('/en?test=123&main-layout-search=1');

    instance['headerIconBtn']?.dispatchEvent(new MouseEvent('click'));

    await instance.load(
      'en', 
      {
        fragment: fragment(location.pathname),
        query: query(location.search),
        match: [],
        options: {}
      }, 
      false
    );

    expect(instance['drawerElem']?.classList.contains('drawer-open')).toBeTruthy();
    expect(instance['navIcon']?.getAttribute('href')).toEqual(`?test=123&main-layout-search=1`);
    expect(instance['headerIconBtn']?.getAttribute('href')).toEqual(`?test=123&main-layout-search=1`);
    expect(instance['searchIcon']?.getAttribute('href')).toEqual(`?test=123&main-layout-navigation=1`);
    expect(instance['langList']?.children[0].classList.contains('list-item-activated')).toBeFalsy();
    expect(instance['langList']?.children[0].getAttribute('href')).toEqual('/kz?test=123&main-layout-search=1&main-layout-navigation=1');
    expect(instance['langList']?.children[1].classList.contains('list-item-activated')).toBeFalsy();
    expect(instance['langList']?.children[1].getAttribute('href')).toEqual('/ru?test=123&main-layout-search=1&main-layout-navigation=1');
    expect(instance['langList']?.children[2].classList.contains('list-item-activated')).toBeTruthy();
    expect(instance['langList']?.children[2].getAttribute('href')).toEqual('/en?test=123&main-layout-search=1&main-layout-navigation=1');

    instance['signInUpElem']?.dispatchEvent(new MouseEvent('click'));

    expect(location.pathname).toEqual('/en/sign-in');

    instance['langList']?.children[0].dispatchEvent(new MouseEvent('click'));

    expect(location.pathname).toEqual('/kz');

    instance['langList']?.children[1].dispatchEvent(new MouseEvent('click'));

    expect(location.pathname).toEqual('/ru');

    instance['langList']?.children[2].dispatchEvent(new MouseEvent('click'));

    expect(location.pathname).toEqual('/en');

    instance['list']?.children[0].dispatchEvent(new MouseEvent('mouseenter'));

    expect(instance['drawerElem']?.classList.contains('drawer-hover')).toBeTruthy();

    instance['drawerElem']?.dispatchEvent(new MouseEvent('mouseleave'));

    expect(instance['drawerElem']?.classList.contains('drawer-hover')).toBeFalsy();

    instance['drawerElem']?.querySelector('.drawer-lang-bar')?.dispatchEvent(new MouseEvent('mouseenter'));

    expect(instance['drawerElem']?.classList.contains('drawer-hover')).toBeTruthy();

    instance['searchInput']?.dispatchEvent(new FocusEvent('focus'));

    expect(instance['searchPanel']?.classList.contains('search-focus')).toBeTruthy();  

    instance['searchInput'].value = 'Hello World!';

    instance['searchForm']?.querySelector('.search-icon-right')?.dispatchEvent(new MouseEvent('click'));

    expect(instance['searchPanel']?.classList.contains('search-focus')).toBeTruthy();
    expect(instance['searchInput']?.value).toBeFalsy();

    instance['searchForm']?.querySelector('.search-icon-left')?.dispatchEvent(new MouseEvent('click'));

    expect(instance['searchPanel']?.classList.contains('search-focus')).toBeFalsy();

    instance['searchInput']?.dispatchEvent(new FocusEvent('focus'));

    expect(instance['searchPanel']?.classList.contains('search-focus')).toBeTruthy();

    instance['searchForm']?.dispatchEvent(new Event('submit'));

    expect(instance['searchPanel']?.classList.contains('search-focus')).toBeFalsy();
  });
});

import { Page } from '@azizka/router';

import { RouteOptions } from '../../data/route-options';
import { RouteState } from '../../data/route-state';

import { View } from '../view';
import { BaseLayout } from "./base-layout";

import { ScrollActionTo, ScrollActionTop, ScrollEventData, ScrollEventType, SCROLL_THRESHOLD } from '../../data/scroll';

import { changeLangPath, toggleQueryParameter } from "../../../helpers";
import { navigateHandler } from '../../helpers';

import { context } from '../../globals';
import { DEFAULT_LANGUAGE, LANGUAGES } from "../../../globals";

export class MainLayout extends BaseLayout implements View {
  protected static layout: MainLayout | null = null;    

  protected node: HTMLElement | null = null;

  protected appBarElem: HTMLElement | null = null;
  protected drawerElem: HTMLElement | null = null;  

  protected navIcon: HTMLElement | null = null;
  protected searchIcon: HTMLElement | null = null;

  protected headerIconElem: HTMLElement | null = null;
  protected headerIconBtn: HTMLElement | null = null;

  protected signInUpElem: HTMLElement | null = null;
  protected signOutElem: HTMLElement | null = null;

  protected list: HTMLElement | null = null;
  protected langList: HTMLElement | null = null;

  protected langElem: HTMLElement | null = null;
  protected langImageElem: HTMLImageElement | null = null;

  protected searchPanel: HTMLElement | null = null;
  protected searchForm: HTMLFormElement | null = null;  
  protected searchInput: HTMLInputElement | null = null;

  protected navIconClickHandler: (event: MouseEvent) => void;
  protected searchIconClickHandler: (event: MouseEvent) => void;
  protected headerIconBtnClickHandler: (event: MouseEvent) => void;

  protected addDrawerHoverClassHandler: () => void;
  protected removeDrawerHoverClassHandler: () => void;

  protected signInUpElemClickHandler: (event: MouseEvent) => void;

  protected langListItemClickHandlers: ((event: MouseEvent) => void)[] = [];

  protected searchInputFocusHandler: () => void;
  protected searchIconRightClickHandler: () => void;
  protected searchIconLeftClickHandler: () => void;
  protected searchFormSubmitHandler: (event: SubmitEvent) => void;

  protected windowScrollHandler: () => void;

  static get instance(): MainLayout {
    if(!MainLayout.layout) {
      MainLayout.layout = new MainLayout();
    }

    return MainLayout.layout;
  }

  constructor() {
    super();

    this.navIconClickHandler = event => navigateHandler(event, this.navIcon as HTMLElement);
    this.searchIconClickHandler = event => navigateHandler(event, this.searchIcon as HTMLElement);
    this.headerIconBtnClickHandler = event => navigateHandler(event, this.headerIconBtn as HTMLElement);

    this.addDrawerHoverClassHandler = () => this.drawerElem?.classList.add('drawer-hover');
    this.removeDrawerHoverClassHandler = () => this.drawerElem?.classList.remove('drawer-hover');

    this.signInUpElemClickHandler = event => navigateHandler(event, this.signInUpElem as HTMLElement);

    this.searchInputFocusHandler = () => this.searchPanel?.classList.add('search-focus');
    
    this.searchIconRightClickHandler = () => {        
      if(this.searchInput) {
        this.searchInput.value = '';
        this.searchInput.focus();
      }
    };

    this.searchIconLeftClickHandler = () => {
      this.searchPanel?.classList.remove('search-focus');
      this.searchInput?.blur();
    };

    this.searchFormSubmitHandler = event => {
      event.preventDefault();

      console.log('Form submited:', this.searchInput?.value);          

      this.searchPanel?.classList.remove('search-focus');
      this.searchInput?.blur();
    };

    let prevScroll = 0;

    this.windowScrollHandler = () => {      
      const currScroll = window.scrollY || 0;

      if(Math.abs(currScroll - prevScroll) > SCROLL_THRESHOLD) {
        if(prevScroll >= currScroll) {
          this.appBarElem?.classList.remove('app-bar-hide');            
        } else {
          this.appBarElem?.classList.add('app-bar-hide');
        }
      }      

      if(currScroll <= 0) {
        this.appBarElem?.classList.remove('app-bar-scrolled');
      } else {
        this.appBarElem?.classList.add('app-bar-scrolled');
      }

      this.node?.dispatchEvent(new CustomEvent<ScrollEventData>(ScrollEventType, {
        detail: {
          currScroll,
          prevScroll
        }
      }));
      
      prevScroll = currScroll;
    };
  }

  get elem(): HTMLElement | null {
    return this.node;
  }

  async init(parent: HTMLElement | null, firstTime: boolean) {
    let content = parent || document.body;

    this.node = content.querySelector('[data-layout="main-layout"]') || null; 

    if(this.node) {
      this.appBarElem = this.node.querySelector('.app-bar');          

      this.navIcon = this.appBarElem?.querySelector('[data-button="navigation"]') || null;      
      this.searchIcon = this.appBarElem?.querySelector('[data-button="search"]') || null;      

      this.drawerElem = this.node.querySelector('.drawer');   
      this.drawerElem?.classList.remove('drawer-hoverable');

      this.headerIconBtn = this.drawerElem?.querySelector('[data-button="header-navigation"]') || null;
      this.headerIconElem = this.headerIconBtn?.querySelector('[data-icon="header-navigation-icon"]') || null;              

      const drawerAccountBar = this.drawerElem?.querySelector('.drawer-account-bar');

      this.signInUpElem = drawerAccountBar?.querySelector('[data-content="sign-in-up"]') || null;    
      this.signOutElem = drawerAccountBar?.querySelector('[data-content="sign-out"]') || null;     

      const drawerLangBar = this.drawerElem?.querySelector('.drawer-lang-bar');      

      this.langElem = drawerLangBar?.querySelector('[data-content="lang"]') || null;
      this.langImageElem = drawerLangBar?.querySelector('[data-image="lang"]') || null;

      this.langList = drawerLangBar?.querySelector('[data-list="lang"]') || null;
      this.list = this.drawerElem?.querySelector('[data-list="main"]') || null;            

      this.searchPanel = this.appBarElem?.querySelector('.search') || null;

      this.searchForm = this.searchPanel?.querySelector('form') || null; 

      this.searchInput = this.searchForm?.querySelector('.search-input') as HTMLInputElement;      
    }

    return content;
  }

  async mount() {
    this.navIcon?.addEventListener('click', this.navIconClickHandler);
    this.searchIcon?.addEventListener('click', this.searchIconClickHandler);   
    this.headerIconBtn?.addEventListener('click', this.headerIconBtnClickHandler);   

    const drawerAccountBar = this.drawerElem?.querySelector('.drawer-account-bar');
    drawerAccountBar?.addEventListener('mouseenter', this.addDrawerHoverClassHandler);

    this.signInUpElem?.addEventListener('click', this.signInUpElemClickHandler);

    const drawerLangBar = this.drawerElem?.querySelector('.drawer-lang-bar');
    drawerLangBar?.addEventListener('mouseenter', this.addDrawerHoverClassHandler);

    const drawerLangCheckbox = drawerLangBar?.querySelector('input[type="checkbox"]') as HTMLInputElement; 
    const drawerLangBarCurrent = drawerLangBar?.querySelector('.drawer-lang-bar-current');

    if(this.langList) {
      for(let i = 0; i < this.langList.children.length; i++) {
        const item = this.langList.children[i];

        const handler = (event: MouseEvent) => {
          drawerLangBarCurrent?.classList.add('drawer-lang-bar-current-loading');

          navigateHandler(event, item as HTMLElement);

          if(drawerLangCheckbox) {
            drawerLangCheckbox.checked = false;
          }
        };

        (item as HTMLElement).addEventListener('click', handler);
        this.langListItemClickHandlers.push(handler);
      }
    }

    if(this.list) {
      for(let i = 0; i < this.list.children.length; i++) {
        const item = this.list.children[i];

        item.addEventListener('mouseenter', this.addDrawerHoverClassHandler);
      }        
    }

    this.drawerElem?.addEventListener('mouseleave', this.removeDrawerHoverClassHandler);

    this.searchInput?.addEventListener('focus', this.searchInputFocusHandler);
    this.searchForm?.querySelector('.search-icon-right')?.addEventListener('click', this.searchIconRightClickHandler);
    this.searchForm?.querySelector('.search-icon-left')?.addEventListener('click', this.searchIconLeftClickHandler);
    this.searchForm?.addEventListener('submit', this.searchFormSubmitHandler);

    window.addEventListener('scroll', this.windowScrollHandler);

    await this.content?.mount?.();   
  }

  async unmount() {
    this.navIcon?.removeEventListener('click', this.navIconClickHandler);
    this.searchIcon?.removeEventListener('click', this.searchIconClickHandler);    
    this.headerIconBtn?.removeEventListener('click', this.headerIconBtnClickHandler);  

    const drawerAccountBar = this.drawerElem?.querySelector('.drawer-account-bar');
    drawerAccountBar?.removeEventListener('mouseenter', this.addDrawerHoverClassHandler);

    this.signInUpElem?.removeEventListener('click', this.signInUpElemClickHandler);

    const drawerLangBar = this.drawerElem?.querySelector('.drawer-lang-bar');
    drawerLangBar?.removeEventListener('mouseenter', this.addDrawerHoverClassHandler);

    if(this.langList) {
      for(let i = 0; i < this.langList.children.length; i++) {
        (this.langList.children[i] as HTMLElement).removeEventListener('click', this.langListItemClickHandlers[i]);
      }
    }

    this.langListItemClickHandlers = [];

    if(this.list) {
      for(let i = 0; i < this.list.children.length; i++) {
        const item = this.list.children[i];

        item.removeEventListener('mouseenter', this.addDrawerHoverClassHandler);
      }        
    }

    this.drawerElem?.removeEventListener('mouseleave', this.removeDrawerHoverClassHandler);

    this.searchInput?.removeEventListener('focus', this.searchInputFocusHandler);
    this.searchForm?.querySelector('.search-icon-right')?.removeEventListener('click', this.searchIconRightClickHandler);
    this.searchForm?.querySelector('.search-icon-left')?.removeEventListener('click', this.searchIconLeftClickHandler);
    this.searchForm?.removeEventListener('submit', this.searchFormSubmitHandler);

    window.removeEventListener('scroll', this.windowScrollHandler);

    this.removeDrawerHoverClassHandler();

    this.drawerElem?.classList.remove('drawer-open');

    await this.content?.unmount?.();
  } 

  async load(lang: string, page: Page<RouteOptions, RouteState>, firstLoad: boolean) {    
    const navigation = page.query['main-layout-navigation'];    

    if(this.navIcon) {      
      const path = `?${toggleQueryParameter(page.query, 'main-layout-navigation')}`;

      this.navIcon.setAttribute('href', path);
    }

    if(this.headerIconBtn) {
      const path = `?${toggleQueryParameter(page.query, 'main-layout-navigation')}`;

      this.headerIconBtn.setAttribute('href', path);
    }

    if(this.searchIcon) {    
      const path = `?${toggleQueryParameter(page.query, 'main-layout-search')}`;

      this.searchIcon.setAttribute('href', path);
    }

    if(navigation) {
      this.headerIconElem?.classList.remove('drawer-header-icon-hide');
      this.drawerElem?.classList.add('drawer-open');
    } else {
      this.headerIconElem?.classList.add('drawer-header-icon-hide'); 
      this.drawerElem?.classList.remove('drawer-open');
    }

    if(this.signInUpElem) {
      this.signInUpElem.textContent = context.tr('Sign In/Up');
      this.signInUpElem.setAttribute('href', (lang === DEFAULT_LANGUAGE ? '' : `/${lang}`) +  '/sign-in');
    }

    if(this.signOutElem) {
      this.signOutElem.textContent = context.tr('Sign Out');

      const langRoute = lang === DEFAULT_LANGUAGE ? '' : `/${lang}`;

      this.signOutElem.setAttribute('href', `/auth/sign-out?redirect=${langRoute}/sign-in`);      
    }

    const drawerLangBar = this.drawerElem?.querySelector('.drawer-lang-bar');
    const drawerLangBarCurrent = drawerLangBar?.querySelector('.drawer-lang-bar-current');

    drawerLangBarCurrent?.classList.remove('drawer-lang-bar-current-loading');

    if(this.langElem) {
      this.langElem.textContent = (LANGUAGES as any)[lang]?.label;
    }

    if(this.langImageElem) {
      this.langImageElem.src = (LANGUAGES as any)[lang]?.image;
    }

    if(this.langList) {      
      for(let i = 0; i < this.langList.children.length; i++) {
        const item = this.langList.children[i];

        if(item.getAttribute('data-list-item') === `lang-${lang}`) {
          item.classList.add('list-item-activated');
        } else {
          item.classList.remove('list-item-activated');
        }                

        const itemLang = item.getAttribute('data-list-item')?.split('-')[1] || DEFAULT_LANGUAGE;
        const path = changeLangPath(location.pathname, itemLang);

        item.setAttribute(
          'href', 
          `/${path + location.search}`
        );
      }
    }
  }

  listen(type: string, listener: EventListenerOrEventListenerObject) {
    this.node?.addEventListener(type, listener);
  }

  unlisten(type: string, listener: EventListenerOrEventListenerObject) {
    this.node?.removeEventListener(type, listener);
  }

  performAction(type: string, data: any) {
    switch(type) {
      case ScrollActionTop:
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        break;
      case ScrollActionTo: 
        window.scrollTo({
          top: data?.top,
          behavior: data?.noSmooth ? 'auto' : 'smooth'
        });                
        break;
    }
  }
}

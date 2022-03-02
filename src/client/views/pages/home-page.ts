import { Page } from '@azizka/router';

import { View } from '../view';

import { ScrollActionTop, ScrollEventData, ScrollEventType, ScrollActionTo } from '../../data/scroll';

import { loadContent } from '../../helpers';

import { layouts } from '../../globals';

export class HomePage implements View {
  protected static page: HomePage | null = null;

  protected node: HTMLElement | null = null;

  protected scrollTopBtn: HTMLElement | null = null;

  protected scrollTopBtnClickHandler: () => void;

  protected windowScrollHandler: (event: Event) => void;

  protected currScroll = 0;

  static get instance(): HomePage {
    if(!HomePage.page) {
      HomePage.page = new HomePage();
    }

    return HomePage.page;
  }

  constructor() {
    this.scrollTopBtnClickHandler = () => {
      layouts['main-layout']?.performAction?.(ScrollActionTop, null);
    };

    this.windowScrollHandler = (event) => {
      const data = (event as CustomEvent<ScrollEventData>).detail;

      if(data.currScroll <= 0) {
        this.scrollTopBtn?.classList.add('btn-exited');
      } else {
        this.scrollTopBtn?.classList.remove('btn-exited');
      }

      this.currScroll = data.currScroll;
    };
  }

  get elem(): HTMLElement | null {
    return this.node;
  }

  async init(parent: HTMLElement | null, firstTime: boolean) {
    let content = await loadContent(parent, firstTime, ['main-layout']);    

    this.node = content.querySelector('[data-page="home-page"]') || null;

    this.scrollTopBtn = this.node?.querySelector('[data-button="scroll-top"]') || null;    
    
    return content;
  }

  async mount() {
    this.scrollTopBtn?.addEventListener('click', this.scrollTopBtnClickHandler);

    layouts['main-layout']?.listen?.(ScrollEventType, this.windowScrollHandler);
  }

  async unmount() {
    this.scrollTopBtn?.removeEventListener('click', this.scrollTopBtnClickHandler);

    layouts['main-layout']?.unlisten?.(ScrollEventType, this.windowScrollHandler);
  }

  async load(lang: string, page: Page, firstLoad: boolean) {
    layouts['main-layout']?.performAction?.(ScrollActionTo, {
      top: this.currScroll,
      noSmooth: true
    });
  }
}

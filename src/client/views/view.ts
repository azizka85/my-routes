import { Page } from '@azizka/router';

import { RouteOptions } from '../data/route-options';
import { RouteState } from '../data/route-state';

export interface Listener {
  listen?(type: string, listener: EventListenerOrEventListenerObject): void;
  unlisten?(type: string, listener: EventListenerOrEventListenerObject): void;
  performAction?(type: string, data: any): void;
}

export interface Component extends Listener {
  init(view: View, firstTime: boolean): Promise<void>;

  mount?(): Promise<void>;
  unmount?(): Promise<void>;

  load?(
    lang: string, 
    page: Page<RouteOptions, RouteState>, 
    firstLoad: boolean
  ): Promise<void>;
}

export interface View extends Listener {
  get elem(): HTMLElement | null;  

  init(parent: HTMLElement | null, firstTime: boolean): Promise<HTMLElement>;

  replaceSelf?(content: View): Promise<void>;

  mount?(): Promise<void>;
  unmount?(): Promise<void>;

  load?(
    lang: string, 
    page: Page<RouteOptions, RouteState>, 
    firstLoad: boolean
  ): Promise<void>;  
}

export interface Layout extends Listener {
  replaceContent(content: View): Promise<void>;
}

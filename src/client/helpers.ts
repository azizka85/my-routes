import { UserActionSetInfo } from './data/user';

import { routeNavigator, layouts as globalLayouts } from "./globals";
import { DEFAULT_LANGUAGE } from '../globals';

export async function sleep(ms?: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function navigateHandler(event: Event, elem: HTMLElement) {
  event.preventDefault();

  const path = elem.getAttribute?.('href');

  if(path) {
    await routeNavigator.navigateTo(path);
  }
}

export async function loadContent(
  parent: HTMLElement | null, 
  firstTime: boolean, 
  layouts: string[]
): Promise<HTMLElement> {
  let content: HTMLElement;

  if(firstTime || parent) {
    content = parent || document.body;
  } else {
    let path = location.pathname + '?ajax=1&init=1&time=' + Date.now();

    const layoutsToLoad = [];

    for(let layout of layouts) {
      if(!(layout in globalLayouts)) {
        layoutsToLoad.push(layout);
      }
    }

    if(layoutsToLoad.length > 0) {
      path += '&layouts=' + layoutsToLoad.join(',');
    }

    const html = await (await fetch(path)).text();
    
    content = document.createElement('div');

    content.innerHTML = html;
  }

  return content;
}

export async function mount(elem: HTMLElement | null) {
  if(elem) {
    await sleep(10);

    elem.classList.remove('page-unmount');
  }
}

export async function unmount(elem: HTMLElement | null) {
  if(elem) {
    elem.classList.add('page-unmount');

    await sleep(250);
  }
}

export function signOut(redirect?: string) {
  globalLayouts['main-layout']?.performAction?.(UserActionSetInfo, null);

  fetch('/auth/sign-out?ajax=1');

  if(redirect) {
    routeNavigator.redirectTo(redirect);
  } else {
    routeNavigator.redirectTo('/');
  }
}

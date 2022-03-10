import { Page } from '@azizka/router';

import { Translator } from '@azizka/i18n';

import { RouteOptions } from '../data/route-options';
import { RouteState } from '../data/route-state';

import { BaseLayout } from '../views/layouts/base-layout';
import { DefaultLayout } from '../views/layouts/default-layout';

import { LoaderPage } from '../views/pages/loader-page';

import { toCamel } from '../../helpers';

import { layouts as globalLayouts, context, languages, views } from '../globals';

export function hideSplash() {
  const splashElem = document.querySelector('.splash');

  splashElem?.classList.remove('splash-open');   
}

export function getExistingLayout(layouts: string[]) {
  const reverseLayouts = [...layouts].reverse();

  let layout: BaseLayout = DefaultLayout.instance;

  for(const layoutName of reverseLayouts) {
    if(!(layoutName in globalLayouts) || layout['content'] !== globalLayouts[layoutName]) {      
      break;
    }

    layout = globalLayouts[layoutName];
  }

  return layout;
}

export async function initLayouts(layouts: string[], parent: HTMLElement | null, firstTime: boolean) {
  const firstLoad: {
    [key: string]: boolean
  } = {};

  for(const layout of layouts) {
    if(!(layout in globalLayouts)) {
      const module = await import(`./views/layouts/${layout}.js?time=${Date.now()}`) as any;

      parent = await module[toCamel(layout)]?.instance?.init?.(parent, firstTime);

      globalLayouts[layout] = module[toCamel(layout)]?.instance;

      firstLoad[layout] = true;
    }
  }

  return firstLoad;
}

export async function loadLayouts(
  lang: string,
  page: Page<RouteOptions, RouteState>,
  layouts: string[], 
  firstLoad: {
    [key: string]: boolean
  }
) {
  const reverseLayouts = [...layouts].reverse();

  let parentLayout = DefaultLayout.instance;
  
  for(const layout of reverseLayouts) {
    if(parentLayout['content'] !== globalLayouts[layout]) {
      await parentLayout.replaceContent(globalLayouts[layout]);
    }

    await globalLayouts[layout].load?.(lang, page, firstLoad[layout] ?? false);

    parentLayout = globalLayouts[layout];
  } 
  
  return parentLayout;
}

export async function loadPage(
  lang: string,
  page: Page<RouteOptions, RouteState>, 
  name: string, 
  layouts: string[], 
  firstTime: boolean
) {
  context.page = page;

  let parent: HTMLElement | null = null;

  let pageFirstLoad = false;

  if(!firstTime && (!(lang in languages) || !(name in views))) {
    const layout = getExistingLayout(layouts);

    if(layout['content'] !== LoaderPage.instance) {
      await layout.replaceContent(LoaderPage.instance);
    }
  } 

  if(!(lang in languages)) {
    const module = await import(`./locales/${lang}.js?time=${Date.now()}`);

    languages[lang] = Translator.create(module.default);
  }

  if(!(name in views)) {       
    const module = await import(`./views/${name}.js?time=${Date.now()}`) as any;

    parent = await module[toCamel(name)]?.instance?.init?.(parent, firstTime);

    views[name] = module[toCamel(name)]?.instance;

    pageFirstLoad = true;
  }

  const firstLoad = await initLayouts(layouts, parent, firstTime);

  if(context.page.fragment === page.fragment) {
    context.tr = languages[lang].translate.bind(languages[lang]);

    document.documentElement.lang = lang;
    document.title = context.tr('My Routes');
    
    const layout = await loadLayouts(lang, page, layouts, firstLoad);    

    if(layout['content'] !== views[name]) {
      await layout.replaceContent(views[name]);
    }

    await views[name].load?.(lang, page, pageFirstLoad);
  }

  if(firstTime) {
    hideSplash();
  }
}

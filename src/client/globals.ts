import { FormattingContext, Translator } from '@azizka/i18n';
import { Router, RouteNavigator, Page } from '@azizka/router';

import { RouteOptions } from './data/route-options';
import { RouteState } from './data/route-state';

import { View } from './views/view';

import { PAGE_ROOT } from '../globals';

export const router = new Router<RouteOptions, RouteState>({ root: PAGE_ROOT });
export const routeNavigator = new RouteNavigator<RouteOptions, RouteState>(router);

export const views: {
  [key: string]: View
} = {};

export const layouts: {
  [key: string]: BaseLayout & View
} = {};

export const languages: {
  [key: string]: Translator
} = {};

export interface GlobalContext {
  page?: Page<RouteOptions, RouteState>,
  tr: (
    text: string | number, 
    defaultNumOrFormatting?: number | FormattingContext, 
    numOrFormattingOrContext?: number | FormattingContext,
    formattingOrContext?: FormattingContext    
  ) => string;
}

const translator = new Translator();

export const context: GlobalContext = {   
  tr: translator.translate.bind(translator)
};

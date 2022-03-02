import { LoaderPage } from './views/pages/loader-page';

import { loadPage } from './helpers/view-helpers';

import { localeRoute } from '../helpers';

import { router, routeNavigator } from './globals';
import { DEFAULT_LANGUAGE } from '../globals';

window.addEventListener('DOMContentLoaded', () => {
  let firstTime = true;    

  LoaderPage.instance.init(null, firstTime);

  router.addRoutes([{
    rule: `${localeRoute}/?`,
    async handler(page) {
      await loadPage(
        page.match?.[0] || DEFAULT_LANGUAGE,
        page, 
        'home-page', 
        ['main-layout'],
        firstTime
      );
    }
  }, {
    rule: `${localeRoute}/?sign-in`,
    async handler(page) {
      await loadPage(
        page.match?.[0] || DEFAULT_LANGUAGE,
        page, 
        'sign-in-page', 
        [], 
        firstTime
      );
    }
  }, {
    rule: `${localeRoute}/?sign-up`,
    async handler(page) {
      await loadPage(
        page.match?.[0] || DEFAULT_LANGUAGE,
        page, 
        'sign-up-page', 
        [], 
        firstTime
      );
    }
  }]);

  routeNavigator.addUriListener();

  router
    .processUrl(routeNavigator.fragment, routeNavigator.query)
    .catch(
      reason => console.error(reason)      
    )
    .finally(() => firstTime = false);
});

import {
  BaseLayout,
  localeRoute,
  toCamel
} from "./chunk-MGPZ2ZF7.js";
import {
  DEFAULT_LANGUAGE,
  context,
  languages,
  layouts,
  require_i18n,
  routeNavigator,
  router,
  views
} from "./chunk-PW6ZC55L.js";
import {
  __publicField,
  __toESM
} from "./chunk-U3RQVIYY.js";

// src/client/views/pages/loader-page.ts
var _LoaderPage = class {
  node = null;
  static get instance() {
    if (!_LoaderPage.page) {
      _LoaderPage.page = new _LoaderPage();
    }
    return _LoaderPage.page;
  }
  get elem() {
    return this.node;
  }
  async init(parent, firstTime) {
    let content = parent || document.body;
    this.node = content.querySelector('[data-page="loader-page"]');
    return content;
  }
};
var LoaderPage = _LoaderPage;
__publicField(LoaderPage, "page", null);

// src/client/helpers/view-helpers.ts
var import_i18n = __toESM(require_i18n());

// src/client/views/layouts/default-layout.ts
var _DefaultLayout = class extends BaseLayout {
  static get instance() {
    if (!_DefaultLayout.layout) {
      _DefaultLayout.layout = new _DefaultLayout();
    }
    return _DefaultLayout.layout;
  }
};
var DefaultLayout = _DefaultLayout;
__publicField(DefaultLayout, "layout", null);

// src/client/helpers/view-helpers.ts
function hideSplash() {
  const splashElem = document.querySelector(".splash");
  splashElem?.classList.remove("splash-open");
}
function getExistingLayout(layouts2) {
  const reverseLayouts = [...layouts2].reverse();
  let layout = DefaultLayout.instance;
  for (const layoutName of reverseLayouts) {
    if (!(layoutName in layouts) || layout["content"] !== layouts[layoutName]) {
      break;
    }
    layout = layouts[layoutName];
  }
  return layout;
}
async function initLayouts(layouts2, parent, firstTime) {
  const firstLoad = {};
  for (const layout of layouts2) {
    if (!(layout in layouts)) {
      const module = await import(`./views/layouts/${layout}.js?time=${Date.now()}`);
      parent = await module[toCamel(layout)]?.instance?.init?.(parent, firstTime);
      layouts[layout] = module[toCamel(layout)]?.instance;
      firstLoad[layout] = true;
    }
  }
  return firstLoad;
}
async function loadLayouts(lang, page, layouts2, firstLoad) {
  const reverseLayouts = [...layouts2].reverse();
  let parentLayout = DefaultLayout.instance;
  for (const layout of reverseLayouts) {
    if (parentLayout["content"] !== layouts[layout]) {
      await parentLayout.replaceContent(layouts[layout]);
    }
    await layouts[layout].load?.(lang, page, firstLoad[layout] ?? false);
    parentLayout = layouts[layout];
  }
  return parentLayout;
}
async function loadPage(lang, page, name, layouts2, firstTime) {
  context.page = page;
  let parent = null;
  let pageFirstLoad = false;
  if (!firstTime && (!(lang in languages) || !(name in views))) {
    const layout = getExistingLayout(layouts2);
    if (layout["content"] !== LoaderPage.instance) {
      await layout.replaceContent(LoaderPage.instance);
    }
  }
  if (!(lang in languages)) {
    const module = await import(`./locales/${lang}.js?time=${Date.now()}`);
    languages[lang] = import_i18n.Translator.create(module.default);
  }
  context.tr = languages[lang].translate.bind(languages[lang]);
  document.documentElement.lang = lang;
  document.title = context.tr("Catalog of Services");
  if (!(name in views)) {
    const module = await import(`./views/${name}.js?time=${Date.now()}`);
    parent = await module[toCamel(name)]?.instance?.init?.(parent, firstTime);
    views[name] = module[toCamel(name)]?.instance;
    pageFirstLoad = true;
  }
  const firstLoad = await initLayouts(layouts2, parent, firstTime);
  if (context.page.fragment === page.fragment) {
    const layout = await loadLayouts(lang, page, layouts2, firstLoad);
    if (layout["content"] !== views[name]) {
      await layout.replaceContent(views[name]);
    }
    await views[name].load?.(lang, page, pageFirstLoad);
  }
  if (firstTime) {
    hideSplash();
  }
}

// src/client/main.ts
window.addEventListener("DOMContentLoaded", () => {
  let firstTime = true;
  LoaderPage.instance.init(null, firstTime);
  router.addRoutes([{
    rule: `${localeRoute}/?`,
    async handler(page) {
      await loadPage(page.match?.[0] || DEFAULT_LANGUAGE, page, "home-page", ["main-layout"], firstTime);
    }
  }, {
    rule: `${localeRoute}/?sign-in`,
    async handler(page) {
      await loadPage(page.match?.[0] || DEFAULT_LANGUAGE, page, "sign-in-page", [], firstTime);
    }
  }, {
    rule: `${localeRoute}/?sign-up`,
    async handler(page) {
      await loadPage(page.match?.[0] || DEFAULT_LANGUAGE, page, "sign-up-page", [], firstTime);
    }
  }]);
  routeNavigator.addUriListener();
  router.processUrl(routeNavigator.fragment, routeNavigator.query).catch((reason) => console.error(reason)).finally(() => firstTime = false);
});
//# sourceMappingURL=main.js.map

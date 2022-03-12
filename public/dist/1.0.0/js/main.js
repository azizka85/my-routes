import {
  BaseLayout,
  localeRoute,
  toCamel
} from "./chunk-NCOTFIR5.js";
import {
  DEFAULT_LANGUAGE,
  context,
  languages,
  layouts,
  require_i18n,
  routeNavigator,
  router,
  views
} from "./chunk-L5HFSNW6.js";
import {
  __commonJS,
  __publicField,
  __toESM
} from "./chunk-U3RQVIYY.js";

// node_modules/@azizka/promise-queue/src/promise-queue.js
var require_promise_queue = __commonJS({
  "node_modules/@azizka/promise-queue/src/promise-queue.js"(exports, module) {
    var PromiseQueue2 = class {
      queueStarted = false;
      tasks = [];
      started;
      finished;
      taskFinished;
      constructor(started, finished, taskFinished) {
        this.started = started;
        this.finished = finished;
        this.taskFinished = taskFinished;
      }
      async start() {
        if (!this.queueStarted) {
          this.queueStarted = true;
          this.started?.();
          let data;
          while (this.tasks.length > 0) {
            const task = this.tasks.splice(0, 1)[0];
            data = await task(data);
            this.taskFinished?.(data);
          }
          this.queueStarted = false;
          this.finished?.();
        }
      }
      addTask(func) {
        this.tasks.push(func);
        this.start();
      }
      stop() {
        this.tasks = [];
      }
    };
    module.exports = {
      PromiseQueue: PromiseQueue2
    };
  }
});

// node_modules/@azizka/promise-queue/index.js
var require_promise_queue2 = __commonJS({
  "node_modules/@azizka/promise-queue/index.js"(exports, module) {
    var { PromiseQueue: PromiseQueue2 } = require_promise_queue();
    module.exports = {
      PromiseQueue: PromiseQueue2
    };
  }
});

// src/client/main.ts
var import_promise_queue = __toESM(require_promise_queue2());

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
function loadPage(queue2, lang, page, name, layouts2, firstTime) {
  let parent = null;
  let pageFirstLoad = false;
  queue2.addTask(async () => {
    if (!firstTime && (!(lang in languages) || !(name in views))) {
      const layout = getExistingLayout(layouts2);
      if (layout["content"] !== LoaderPage.instance) {
        await layout.replaceContent(LoaderPage.instance);
      }
    }
    return {
      status: 1 /* completed */
    };
  });
  queue2.addTask(async (data) => {
    if ((!data || data.status === 1 /* completed */) && !(lang in languages)) {
      try {
        const module = await import(`./locales/${lang}.js?time=${Date.now()}`);
        languages[lang] = import_i18n.Translator.create(module.default);
        data = {
          status: 1 /* completed */
        };
      } catch (err) {
        data = {
          status: 0 /* error */,
          data: err
        };
      }
    }
    return data;
  });
  queue2.addTask(async (data) => {
    if ((!data || data.status === 1 /* completed */) && !(name in views)) {
      try {
        const module = await import(`./views/${name}.js?time=${Date.now()}`);
        parent = await module[toCamel(name)]?.instance?.init?.(parent, firstTime);
        views[name] = module[toCamel(name)]?.instance;
        pageFirstLoad = true;
        data = {
          status: 1 /* completed */
        };
      } catch (err) {
        data = {
          status: 0 /* error */,
          data: err
        };
      }
    }
    return data;
  });
  let firstLoad = {};
  queue2.addTask(async (data) => {
    if (!data || data.status === 1 /* completed */) {
      try {
        firstLoad = await initLayouts(layouts2, parent, firstTime);
        data = {
          status: 1 /* completed */
        };
      } catch (err) {
        data = {
          status: 0 /* error */,
          data: err
        };
      }
    }
    return data;
  });
  queue2.addTask(async (data) => {
    if (!data || data.status === 1 /* completed */) {
      try {
        context.tr = languages[lang].translate.bind(languages[lang]);
        document.documentElement.lang = lang;
        document.title = context.tr("My Routes");
        const layout = await loadLayouts(lang, page, layouts2, firstLoad);
        if (layout["content"] !== views[name]) {
          await layout.replaceContent(views[name]);
        }
        await views[name].load?.(lang, page, pageFirstLoad);
        data = {
          status: 1 /* completed */
        };
      } catch (err) {
        data = {
          status: 0 /* error */,
          data: err
        };
      }
    }
    return data;
  });
  queue2.addTask(async (data) => {
    if (firstTime) {
      hideSplash();
    }
    if (data?.status === 0 /* error */) {
      console.error(data.data);
    }
  });
}

// src/client/main.ts
var queue = new import_promise_queue.PromiseQueue();
window.addEventListener("DOMContentLoaded", () => {
  let firstTime = true;
  LoaderPage.instance.init(null, firstTime);
  router.addRoutes([{
    rule: `${localeRoute}/?`,
    async handler(page) {
      queue.stop();
      await loadPage(queue, page.match?.[0] || DEFAULT_LANGUAGE, page, "home-page", ["main-layout"], firstTime);
    }
  }, {
    rule: `${localeRoute}/?sign-in`,
    async handler(page) {
      queue.stop();
      await loadPage(queue, page.match?.[0] || DEFAULT_LANGUAGE, page, "sign-in-page", [], firstTime);
    }
  }, {
    rule: `${localeRoute}/?sign-up`,
    async handler(page) {
      queue.stop();
      await loadPage(queue, page.match?.[0] || DEFAULT_LANGUAGE, page, "sign-up-page", [], firstTime);
    }
  }]);
  routeNavigator.addUriListener();
  router.processUrl(routeNavigator.fragment, routeNavigator.query).catch((reason) => console.error(reason)).finally(() => firstTime = false);
});
//# sourceMappingURL=main.js.map

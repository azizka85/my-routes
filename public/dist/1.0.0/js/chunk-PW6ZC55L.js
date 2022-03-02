import {
  __commonJS,
  __toESM
} from "./chunk-U3RQVIYY.js";

// node_modules/@azizka/i18n/src/utils.js
var require_utils = __commonJS({
  "node_modules/@azizka/i18n/src/utils.js"(exports, module) {
    function isObject(obj) {
      const type = typeof obj;
      return type === "function" || type === "object" && !!obj;
    }
    module.exports = {
      isObject
    };
  }
});

// node_modules/@azizka/i18n/src/translator.js
var require_translator = __commonJS({
  "node_modules/@azizka/i18n/src/translator.js"(exports, module) {
    var { isObject } = require_utils();
    var Translator2 = class {
      data;
      globalContext;
      extension;
      constructor() {
        this.resetContext();
      }
      static create(data) {
        const translator2 = new Translator2();
        translator2.add(data);
        return translator2;
      }
      translate(text, defaultNumOrFormatting, numOrFormattingOrContext, formattingOrContext) {
        let num = void 0;
        let formatting = void 0;
        let context2 = this.globalContext;
        if (isObject(defaultNumOrFormatting)) {
          formatting = defaultNumOrFormatting;
          if (isObject(numOrFormattingOrContext)) {
            context2 = numOrFormattingOrContext;
          }
        } else if (typeof defaultNumOrFormatting === "number") {
          num = defaultNumOrFormatting;
          formatting = numOrFormattingOrContext;
          if (formattingOrContext) {
            context2 = formattingOrContext;
          }
        } else {
          if (typeof numOrFormattingOrContext === "number") {
            num = numOrFormattingOrContext;
            formatting = formattingOrContext;
          } else {
            formatting = numOrFormattingOrContext;
            if (formattingOrContext) {
              context2 = formattingOrContext;
            }
          }
        }
        return this.translateText(text, num, formatting, context2);
      }
      add(data) {
        if (!this.data) {
          this.data = data;
        } else {
          if (data.values && this.data.values) {
            for (const key of Object.keys(data.values)) {
              this.data.values[key] = data.values[key];
            }
          }
          if (data.contexts && this.data.contexts) {
            for (const context2 of data.contexts) {
              this.data.contexts.push(context2);
            }
          }
        }
      }
      setContext(key, value) {
        his.globalContext[key] = value;
      }
      extend(extension) {
        this.extension = extension;
      }
      clearContext(key) {
        delete this.globalContext[key];
      }
      reset() {
        this.resetData();
        this.resetContext();
      }
      resetData() {
        this.data = {
          values: {},
          contexts: []
        };
      }
      resetContext() {
        this.globalContext = {};
      }
      translateText(text, num, formatting, context2) {
        context2 = context2 || this.globalContext;
        if (!this.data) {
          return this.useOriginalText("" + text, num, formatting);
        }
        const contextData = this.getContextData(this.data, context2);
        let result = null;
        if (contextData) {
          result = this.findTranslation(text, num, formatting, contextData?.values);
        }
        if (result === null) {
          result = this.findTranslation(text, num, formatting, this.data.values);
        }
        if (result === null) {
          result = this.useOriginalText("" + text, num, formatting);
        }
        return result;
      }
      findTranslation(text, num, formatting, data) {
        let value = data?.[text];
        if (value === void 0) {
          return null;
        }
        if (typeof value === "object" && !Array.isArray(value)) {
          if (this.extension) {
            value = "" + this.extension(text, num, formatting, value);
            value = this.applyNumbers(value, num || 0);
            return this.applyFormatting(value, formatting);
          } else {
            return this.useOriginalText("" + text, num, formatting);
          }
        }
        if (num === void 0 && typeof value === "string") {
          return this.applyFormatting(value, formatting);
        } else if (value instanceof Array) {
          for (const triple of value) {
            if (num === void 0 && triple[0] === null && triple[1] === null || num !== void 0 && (triple[0] !== null && num >= triple[0] && (triple[1] === null || num <= triple[1]) || triple[0] === null && triple[1] && num <= triple[1])) {
              const numVal = num || 0;
              const textVal = "" + (triple[2] ?? "");
              const result = this.applyNumbers(textVal, numVal);
              return this.applyFormatting(result, formatting);
            }
          }
        }
        return null;
      }
      applyNumbers(str, num) {
        str = str.replace("-%n", "" + -num);
        str = str.replace("%n", "" + num);
        return str;
      }
      applyFormatting(text, formatting) {
        if (formatting) {
          for (const key of Object.keys(formatting)) {
            const regex = new RegExp(`%{${key}}`, "g");
            text = text.replace(regex, formatting[key]);
          }
        }
        return text;
      }
      getContextData(data, context2) {
        if (!data.contexts) {
          return null;
        }
        for (const ctx of data.contexts) {
          let equal = true;
          for (const key of Object.keys(ctx.matches)) {
            const value = ctx.matches[key];
            equal = equal && value === context2[key];
            if (!equal)
              break;
          }
          if (equal) {
            return ctx;
          }
        }
        return null;
      }
      useOriginalText(text, num, formatting) {
        if (num === void 0) {
          return this.applyFormatting(text, formatting);
        }
        return this.applyFormatting(text.replace("%n", "" + num), formatting);
      }
    };
    module.exports = {
      Translator: Translator2
    };
  }
});

// node_modules/@azizka/i18n/index.js
var require_i18n = __commonJS({
  "node_modules/@azizka/i18n/index.js"(exports, module) {
    var { Translator: Translator2 } = require_translator();
    var { isObject } = require_utils();
    module.exports = {
      Translator: Translator2,
      isObject
    };
  }
});

// node_modules/@azizka/router/src/utils.js
var require_utils2 = __commonJS({
  "node_modules/@azizka/router/src/utils.js"(exports, module) {
    function trimSlashes(path) {
      return path.replace(/\/$/, "").replace(/^\//, "");
    }
    function transformURL(url, currentPath, root) {
      const newUrl = url.trim();
      const splits = newUrl.split("?");
      let path = splits[0].trim();
      const query = splits[1]?.trim();
      if (!path) {
        path = currentPath;
      } else {
        if (root !== "/") {
          path = path.replace(root, "");
        }
        path = trimSlashes(path);
      }
      if (!query) {
        return path;
      }
      return `${path}?${query}`;
    }
    function parseQuery(query) {
      const data = {};
      let search = query;
      if (query[0] === "?") {
        search = query.substring(1);
      }
      search.split("&").forEach((row) => {
        const parts = row.split("=");
        if (parts[0] !== "") {
          const key = decodeURIComponent(parts[0]);
          const value = parts[1] === void 0 ? "1" : parts[1];
          data[key] = value;
        }
      });
      return data;
    }
    function parseRouteRule(route) {
      if (typeof route === "string") {
        const uri = trimSlashes(route);
        const rule = uri.replace(/([\\\/\-\_\.])/g, "\\$1").replace(/\{[a-zA-Z]+\}/g, "(:any)").replace(/\:any/g, "[\\w\\-\\_\\.]+").replace(/\:word/g, "[a-zA-Z]+").replace(/\:num/g, "\\d+");
        return new RegExp(`^${rule}$`, "i");
      }
      return route;
    }
    module.exports = {
      trimSlashes,
      transformURL,
      parseQuery,
      parseRouteRule
    };
  }
});

// node_modules/@azizka/router/src/router.js
var require_router = __commonJS({
  "node_modules/@azizka/router/src/router.js"(exports, module) {
    var { trimSlashes, parseRouteRule } = require_utils2();
    var Router2 = class {
      routes = [];
      root = "/";
      before;
      page404;
      constructor(options) {
        this.before = options?.before;
        this.page404 = options?.page404;
        if (options?.root) {
          this.root = options.root === "/" ? "/" : `/${trimSlashes(options.root)}/`;
        }
        if (options?.routes) {
          this.addRoutes(options.routes);
        }
      }
      get rootPath() {
        return this.root;
      }
      addRoutes(routes) {
        for (const route of routes) {
          this.add(route.rule, route.handler, route.options);
        }
      }
      add(rule, handler, options) {
        this.routes.push({
          rule: parseRouteRule(rule),
          handler,
          options
        });
        return this;
      }
      remove(param) {
        this.routes.some((route, i) => {
          if (route.handler === param || route.rule === parseRouteRule(param)) {
            this.routes.splice(i, 1);
            return true;
          }
          return false;
        });
        return this;
      }
      findRoute(currentPath) {
        for (const route of this.routes) {
          const match = currentPath.match(route.rule);
          if (match) {
            return {
              match,
              route
            };
          }
        }
      }
      async processUrl(currentPath, currentQuery, state) {
        const doBreak = await this.before?.({
          fragment: currentPath,
          query: currentQuery,
          state
        });
        if (!doBreak) {
          const found = this.findRoute(currentPath);
          if (!found) {
            await this.page404?.({
              fragment: currentPath,
              query: currentQuery,
              state
            });
          } else {
            found.match.shift();
            const page = {
              fragment: currentPath,
              query: currentQuery,
              match: found.match,
              options: found.route.options,
              state
            };
            await found.route.handler?.(page);
          }
        }
      }
    };
    module.exports = {
      Router: Router2
    };
  }
});

// node_modules/@azizka/router/src/route-navigator.js
var require_route_navigator = __commonJS({
  "node_modules/@azizka/router/src/route-navigator.js"(exports, module) {
    var { transformURL, trimSlashes, parseQuery } = require_utils2();
    var RouteNavigator2 = class {
      router;
      popStateHandler;
      constructor(router2) {
        this.router = router2;
        this.popStateHandler = () => {
          router2.processUrl(this.fragment, this.query, history.state);
        };
      }
      get fragment() {
        let value = decodeURI(location.pathname);
        if (this.router.rootPath !== "/") {
          value = value.replace(this.router.rootPath, "");
        }
        return trimSlashes(value);
      }
      get query() {
        return parseQuery(location.search);
      }
      async redirectTo(url, state) {
        const newUrl = transformURL(url, this.fragment, this.router.rootPath);
        history.replaceState(state, "", this.router.rootPath + newUrl);
        const currentPath = this.fragment;
        const currentQuery = this.query;
        await this.router.processUrl(currentPath, currentQuery, state);
      }
      async navigateTo(url, state) {
        const newUrl = transformURL(url, this.fragment, this.router.rootPath);
        history.pushState(state, "", this.router.rootPath + newUrl);
        const currentPath = this.fragment;
        const currentQuery = this.query;
        await this.router.processUrl(currentPath, currentQuery, state);
      }
      refresh() {
        return this.redirectTo(this.fragment + location.search, history.state);
      }
      addUriListener() {
        window.addEventListener("popstate", this.popStateHandler);
      }
      removeUriListener() {
        window.removeEventListener("popstate", this.popStateHandler);
      }
    };
    module.exports = {
      RouteNavigator: RouteNavigator2
    };
  }
});

// node_modules/@azizka/router/src/mocks/location-mock.js
var require_location_mock = __commonJS({
  "node_modules/@azizka/router/src/mocks/location-mock.js"(exports, module) {
    var LocationMock = class {
      pathname = "";
      search = "";
    };
    module.exports = {
      LocationMock
    };
  }
});

// node_modules/@azizka/router/src/mocks/history-mock.js
var require_history_mock = __commonJS({
  "node_modules/@azizka/router/src/mocks/history-mock.js"(exports, module) {
    var HistoryMock = class {
      location;
      constructor(location2) {
        this.location = location2;
      }
      replaceState(state, data, path) {
        this.changeLocation(path);
      }
      pushState(state, data, path) {
        this.changeLocation(path);
      }
      changeLocation(path) {
        let splits = path?.split?.("?");
        if (splits) {
          this.location.pathname = splits[0];
          if (splits.length > 1) {
            this.location.search = "?" + splits[1];
          }
        }
      }
    };
    module.exports = {
      HistoryMock
    };
  }
});

// node_modules/@azizka/router/index.js
var require_router2 = __commonJS({
  "node_modules/@azizka/router/index.js"(exports, module) {
    var { Router: Router2 } = require_router();
    var { RouteNavigator: RouteNavigator2 } = require_route_navigator();
    var { trimSlashes, transformURL, parseQuery, parseRouteRule } = require_utils2();
    var { LocationMock } = require_location_mock();
    var { HistoryMock } = require_history_mock();
    module.exports = {
      Router: Router2,
      RouteNavigator: RouteNavigator2,
      trimSlashes,
      transformURL,
      parseQuery,
      parseRouteRule,
      LocationMock,
      HistoryMock
    };
  }
});

// src/globals.ts
var PAGE_ROOT = "/";
var LANGUAGES = {
  kz: {
    image: "/images/flags/kz.svg",
    label: "\u049A\u0430\u0437\u0430\u049B\u0448\u0430"
  },
  ru: {
    image: "/images/flags/ru.svg",
    label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"
  },
  en: {
    image: "/images/flags/en.svg",
    label: "English"
  }
};
var DEFAULT_LANGUAGE = "kz";

// src/client/globals.ts
var import_i18n = __toESM(require_i18n());
var import_router = __toESM(require_router2());
var router = new import_router.Router({ root: PAGE_ROOT });
var routeNavigator = new import_router.RouteNavigator(router);
var views = {};
var layouts = {};
var languages = {};
var translator = new import_i18n.Translator();
var context = {
  tr: translator.translate.bind(translator)
};

// src/client/helpers.ts
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function navigateHandler(event, elem) {
  event.preventDefault();
  const path = elem.getAttribute?.("href");
  if (path) {
    await routeNavigator.navigateTo(path);
  }
}
async function loadContent(parent, firstTime, layouts2) {
  let content;
  if (firstTime || parent) {
    content = parent || document.body;
  } else {
    let path = location.pathname + "?ajax=1&init=1&time=" + Date.now();
    const layoutsToLoad = [];
    for (let layout of layouts2) {
      if (!(layout in layouts)) {
        layoutsToLoad.push(layout);
      }
    }
    if (layoutsToLoad.length > 0) {
      path += "&layouts=" + layoutsToLoad.join(",");
    }
    const html = await (await fetch(path)).text();
    content = document.createElement("div");
    content.innerHTML = html;
  }
  return content;
}
async function mount(elem) {
  if (elem) {
    await sleep(10);
    elem.classList.remove("page-unmount");
  }
}
async function unmount(elem) {
  if (elem) {
    elem.classList.add("page-unmount");
    await sleep(250);
  }
}

export {
  require_i18n,
  require_router2 as require_router,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  router,
  routeNavigator,
  views,
  layouts,
  languages,
  context,
  navigateHandler,
  loadContent,
  mount,
  unmount
};
//# sourceMappingURL=chunk-PW6ZC55L.js.map

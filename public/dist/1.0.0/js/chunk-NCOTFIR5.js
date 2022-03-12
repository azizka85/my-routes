import {
  LANGUAGES,
  mount,
  require_router,
  unmount
} from "./chunk-L5HFSNW6.js";
import {
  __toESM
} from "./chunk-U3RQVIYY.js";

// src/client/views/layouts/base-layout.ts
var BaseLayout = class {
  content = null;
  async replaceContent(content) {
    if (this.content?.replaceSelf) {
      this.content.replaceSelf(content);
    } else {
      await this.content?.unmount?.();
      await unmount(this.content?.elem || null);
      this.content?.elem?.replaceWith(content.elem || "");
      await content.mount?.();
      await mount(content.elem);
    }
    this.content = content;
  }
};

// src/helpers.ts
var import_router = __toESM(require_router());
function getQueryParameters(query) {
  const parameters = [];
  for (let key of Object.keys(query)) {
    if (query[key]) {
      parameters.push(`${key}=${query[key]}`);
    } else {
      parameters.push(key);
    }
  }
  return parameters.join("&");
}
function setQueryParameter(query, parameter, value) {
  const data = { ...query };
  data[parameter] = value;
  return getQueryParameters(data);
}
function toggleQueryParameter(query, parameter) {
  const data = { ...query };
  if (parameter in data) {
    delete data[parameter];
    return getQueryParameters(data);
  }
  return setQueryParameter(data, parameter, "1");
}
function capitalize(input) {
  if (!input) {
    return input;
  }
  const chars = input.split("");
  return chars[0].toUpperCase() + chars.slice(1).join("").toLowerCase();
}
function toCamel(input) {
  const parts = input.split("-");
  return parts.map((item) => capitalize(item)).join("");
}
var localeRoute = `(${Object.keys(LANGUAGES).join("|")})?`;
function changeLangPath(url, lang) {
  url = (0, import_router.trimSlashes)(url);
  const langRoute = new RegExp(`^(${Object.keys(LANGUAGES).join("|")})`);
  const index = url.search(langRoute);
  if (index >= 0) {
    return url.replace(langRoute, lang);
  }
  return `${lang}/${url}`;
}

export {
  BaseLayout,
  toggleQueryParameter,
  toCamel,
  localeRoute,
  changeLangPath
};
//# sourceMappingURL=chunk-NCOTFIR5.js.map

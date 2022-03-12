import {
  BaseLayout,
  changeLangPath,
  toggleQueryParameter
} from "../../chunk-NCOTFIR5.js";
import {
  SCROLL_THRESHOLD,
  ScrollActionTo,
  ScrollActionTop,
  ScrollEventType
} from "../../chunk-4I57QA7S.js";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  context,
  navigateHandler
} from "../../chunk-L5HFSNW6.js";
import {
  __publicField
} from "../../chunk-U3RQVIYY.js";

// src/client/views/layouts/main-layout.ts
var _MainLayout = class extends BaseLayout {
  node = null;
  appBarElem = null;
  drawerElem = null;
  navIcon = null;
  searchIcon = null;
  headerIconElem = null;
  headerIconBtn = null;
  signInUpElem = null;
  signOutElem = null;
  list = null;
  langList = null;
  langElem = null;
  langImageElem = null;
  searchPanel = null;
  searchForm = null;
  searchInput = null;
  navIconClickHandler;
  searchIconClickHandler;
  headerIconBtnClickHandler;
  addDrawerHoverClassHandler;
  removeDrawerHoverClassHandler;
  signInUpElemClickHandler;
  langListItemClickHandlers = [];
  searchInputFocusHandler;
  searchIconRightClickHandler;
  searchIconLeftClickHandler;
  searchFormSubmitHandler;
  windowScrollHandler;
  static get instance() {
    if (!_MainLayout.layout) {
      _MainLayout.layout = new _MainLayout();
    }
    return _MainLayout.layout;
  }
  constructor() {
    super();
    this.navIconClickHandler = (event) => navigateHandler(event, this.navIcon);
    this.searchIconClickHandler = (event) => navigateHandler(event, this.searchIcon);
    this.headerIconBtnClickHandler = (event) => navigateHandler(event, this.headerIconBtn);
    this.addDrawerHoverClassHandler = () => this.drawerElem?.classList.add("drawer-hover");
    this.removeDrawerHoverClassHandler = () => this.drawerElem?.classList.remove("drawer-hover");
    this.signInUpElemClickHandler = (event) => navigateHandler(event, this.signInUpElem);
    this.searchInputFocusHandler = () => this.searchPanel?.classList.add("search-focus");
    this.searchIconRightClickHandler = () => {
      if (this.searchInput) {
        this.searchInput.value = "";
        this.searchInput.focus();
      }
    };
    this.searchIconLeftClickHandler = () => {
      this.searchPanel?.classList.remove("search-focus");
      this.searchInput?.blur();
    };
    this.searchFormSubmitHandler = (event) => {
      event.preventDefault();
      console.log("Form submited:", this.searchInput?.value);
      this.searchPanel?.classList.remove("search-focus");
      this.searchInput?.blur();
    };
    let prevScroll = 0;
    this.windowScrollHandler = () => {
      const currScroll = window.scrollY || 0;
      if (Math.abs(currScroll - prevScroll) > SCROLL_THRESHOLD) {
        if (prevScroll >= currScroll) {
          this.appBarElem?.classList.remove("app-bar-hide");
        } else {
          this.appBarElem?.classList.add("app-bar-hide");
        }
      }
      if (currScroll <= 0) {
        this.appBarElem?.classList.remove("app-bar-scrolled");
      } else {
        this.appBarElem?.classList.add("app-bar-scrolled");
      }
      this.node?.dispatchEvent(new CustomEvent(ScrollEventType, {
        detail: {
          currScroll,
          prevScroll
        }
      }));
      prevScroll = currScroll;
    };
  }
  get elem() {
    return this.node;
  }
  async init(parent, firstTime) {
    let content = parent || document.body;
    this.node = content.querySelector('[data-layout="main-layout"]') || null;
    if (this.node) {
      this.appBarElem = this.node.querySelector(".app-bar");
      this.navIcon = this.appBarElem?.querySelector('[data-button="navigation"]') || null;
      this.searchIcon = this.appBarElem?.querySelector('[data-button="search"]') || null;
      this.drawerElem = this.node.querySelector(".drawer");
      this.drawerElem?.classList.remove("drawer-hoverable");
      this.headerIconBtn = this.drawerElem?.querySelector('[data-button="header-navigation"]') || null;
      this.headerIconElem = this.headerIconBtn?.querySelector('[data-icon="header-navigation-icon"]') || null;
      const drawerAccountBar = this.drawerElem?.querySelector(".drawer-account-bar");
      this.signInUpElem = drawerAccountBar?.querySelector('[data-content="sign-in-up"]') || null;
      this.signOutElem = drawerAccountBar?.querySelector('[data-content="sign-out"]') || null;
      const drawerLangBar = this.drawerElem?.querySelector(".drawer-lang-bar");
      this.langElem = drawerLangBar?.querySelector('[data-content="lang"]') || null;
      this.langImageElem = drawerLangBar?.querySelector('[data-image="lang"]') || null;
      this.langList = drawerLangBar?.querySelector('[data-list="lang"]') || null;
      this.list = this.drawerElem?.querySelector('[data-list="main"]') || null;
      this.searchPanel = this.appBarElem?.querySelector(".search") || null;
      this.searchForm = this.searchPanel?.querySelector("form") || null;
      this.searchInput = this.searchForm?.querySelector(".search-input");
    }
    return content;
  }
  async mount() {
    this.navIcon?.addEventListener("click", this.navIconClickHandler);
    this.searchIcon?.addEventListener("click", this.searchIconClickHandler);
    this.headerIconBtn?.addEventListener("click", this.headerIconBtnClickHandler);
    const drawerAccountBar = this.drawerElem?.querySelector(".drawer-account-bar");
    drawerAccountBar?.addEventListener("mouseenter", this.addDrawerHoverClassHandler);
    this.signInUpElem?.addEventListener("click", this.signInUpElemClickHandler);
    const drawerLangBar = this.drawerElem?.querySelector(".drawer-lang-bar");
    drawerLangBar?.addEventListener("mouseenter", this.addDrawerHoverClassHandler);
    const drawerLangCheckbox = drawerLangBar?.querySelector('input[type="checkbox"]');
    const drawerLangBarCurrent = drawerLangBar?.querySelector(".drawer-lang-bar-current");
    if (this.langList) {
      for (let i = 0; i < this.langList.children.length; i++) {
        const item = this.langList.children[i];
        const handler = (event) => {
          drawerLangBarCurrent?.classList.add("drawer-lang-bar-current-loading");
          navigateHandler(event, item);
          if (drawerLangCheckbox) {
            drawerLangCheckbox.checked = false;
          }
        };
        item.addEventListener("click", handler);
        this.langListItemClickHandlers.push(handler);
      }
    }
    if (this.list) {
      for (let i = 0; i < this.list.children.length; i++) {
        const item = this.list.children[i];
        item.addEventListener("mouseenter", this.addDrawerHoverClassHandler);
      }
    }
    this.drawerElem?.addEventListener("mouseleave", this.removeDrawerHoverClassHandler);
    this.searchInput?.addEventListener("focus", this.searchInputFocusHandler);
    this.searchForm?.querySelector(".search-icon-right")?.addEventListener("click", this.searchIconRightClickHandler);
    this.searchForm?.querySelector(".search-icon-left")?.addEventListener("click", this.searchIconLeftClickHandler);
    this.searchForm?.addEventListener("submit", this.searchFormSubmitHandler);
    window.addEventListener("scroll", this.windowScrollHandler);
    await this.content?.mount?.();
  }
  async unmount() {
    this.navIcon?.removeEventListener("click", this.navIconClickHandler);
    this.searchIcon?.removeEventListener("click", this.searchIconClickHandler);
    this.headerIconBtn?.removeEventListener("click", this.headerIconBtnClickHandler);
    const drawerAccountBar = this.drawerElem?.querySelector(".drawer-account-bar");
    drawerAccountBar?.removeEventListener("mouseenter", this.addDrawerHoverClassHandler);
    this.signInUpElem?.removeEventListener("click", this.signInUpElemClickHandler);
    const drawerLangBar = this.drawerElem?.querySelector(".drawer-lang-bar");
    drawerLangBar?.removeEventListener("mouseenter", this.addDrawerHoverClassHandler);
    if (this.langList) {
      for (let i = 0; i < this.langList.children.length; i++) {
        this.langList.children[i].removeEventListener("click", this.langListItemClickHandlers[i]);
      }
    }
    this.langListItemClickHandlers = [];
    if (this.list) {
      for (let i = 0; i < this.list.children.length; i++) {
        const item = this.list.children[i];
        item.removeEventListener("mouseenter", this.addDrawerHoverClassHandler);
      }
    }
    this.drawerElem?.removeEventListener("mouseleave", this.removeDrawerHoverClassHandler);
    this.searchInput?.removeEventListener("focus", this.searchInputFocusHandler);
    this.searchForm?.querySelector(".search-icon-right")?.removeEventListener("click", this.searchIconRightClickHandler);
    this.searchForm?.querySelector(".search-icon-left")?.removeEventListener("click", this.searchIconLeftClickHandler);
    this.searchForm?.removeEventListener("submit", this.searchFormSubmitHandler);
    window.removeEventListener("scroll", this.windowScrollHandler);
    this.removeDrawerHoverClassHandler();
    this.drawerElem?.classList.remove("drawer-open");
    await this.content?.unmount?.();
  }
  async load(lang, page, firstLoad) {
    const navigation = page.query["main-layout-navigation"];
    if (this.navIcon) {
      const path = `?${toggleQueryParameter(page.query, "main-layout-navigation")}`;
      this.navIcon.setAttribute("href", path);
    }
    if (this.headerIconBtn) {
      const path = `?${toggleQueryParameter(page.query, "main-layout-navigation")}`;
      this.headerIconBtn.setAttribute("href", path);
    }
    if (this.searchIcon) {
      const path = `?${toggleQueryParameter(page.query, "main-layout-search")}`;
      this.searchIcon.setAttribute("href", path);
    }
    if (navigation) {
      this.headerIconElem?.classList.remove("drawer-header-icon-hide");
      this.drawerElem?.classList.add("drawer-open");
    } else {
      this.headerIconElem?.classList.add("drawer-header-icon-hide");
      this.drawerElem?.classList.remove("drawer-open");
    }
    if (this.signInUpElem) {
      this.signInUpElem.textContent = context.tr("Sign In/Up");
      this.signInUpElem.setAttribute("href", (lang === DEFAULT_LANGUAGE ? "" : `/${lang}`) + "/sign-in");
    }
    if (this.signOutElem) {
      this.signOutElem.textContent = context.tr("Sign Out");
      const langRoute = lang === DEFAULT_LANGUAGE ? "" : `/${lang}`;
      this.signOutElem.setAttribute("href", `/auth/sign-out?redirect=${langRoute}/sign-in`);
    }
    const drawerLangBar = this.drawerElem?.querySelector(".drawer-lang-bar");
    const drawerLangBarCurrent = drawerLangBar?.querySelector(".drawer-lang-bar-current");
    drawerLangBarCurrent?.classList.remove("drawer-lang-bar-current-loading");
    if (this.langElem) {
      this.langElem.textContent = LANGUAGES[lang]?.label;
    }
    if (this.langImageElem) {
      this.langImageElem.src = LANGUAGES[lang]?.image;
    }
    if (this.langList) {
      for (let i = 0; i < this.langList.children.length; i++) {
        const item = this.langList.children[i];
        if (item.getAttribute("data-list-item") === `lang-${lang}`) {
          item.classList.add("list-item-activated");
        } else {
          item.classList.remove("list-item-activated");
        }
        const itemLang = item.getAttribute("data-list-item")?.split("-")[1] || DEFAULT_LANGUAGE;
        const path = changeLangPath(location.pathname, itemLang);
        item.setAttribute("href", `/${path + location.search}`);
      }
    }
  }
  listen(type, listener) {
    this.node?.addEventListener(type, listener);
  }
  unlisten(type, listener) {
    this.node?.removeEventListener(type, listener);
  }
  performAction(type, data) {
    switch (type) {
      case ScrollActionTop:
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        break;
      case ScrollActionTo:
        window.scrollTo({
          top: data?.top,
          behavior: data?.noSmooth ? "auto" : "smooth"
        });
        break;
    }
  }
};
var MainLayout = _MainLayout;
__publicField(MainLayout, "layout", null);
export {
  MainLayout
};
//# sourceMappingURL=main-layout.js.map

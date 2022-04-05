import {
  ScrollActionTo,
  ScrollActionTop,
  ScrollEventType
} from "../chunk-4I57QA7S.js";
import {
  layouts,
  loadContent
} from "../chunk-7FYKLDJF.js";
import {
  __publicField
} from "../chunk-U3RQVIYY.js";

// src/client/views/pages/home-page.ts
var _HomePage = class {
  node = null;
  scrollTopBtn = null;
  scrollTopBtnClickHandler;
  windowScrollHandler;
  currScroll = 0;
  static get instance() {
    if (!_HomePage.page) {
      _HomePage.page = new _HomePage();
    }
    return _HomePage.page;
  }
  constructor() {
    this.scrollTopBtnClickHandler = () => {
      layouts["main-layout"]?.performAction?.(ScrollActionTop, null);
    };
    this.windowScrollHandler = (event) => {
      const data = event.detail;
      if (data.currScroll <= 0) {
        this.scrollTopBtn?.classList.add("btn-exited");
      } else {
        this.scrollTopBtn?.classList.remove("btn-exited");
      }
      this.currScroll = data.currScroll;
    };
  }
  get elem() {
    return this.node;
  }
  async init(parent, firstTime) {
    let content = await loadContent(parent, firstTime, ["main-layout"]);
    this.node = content.querySelector('[data-page="home-page"]') || null;
    this.scrollTopBtn = this.node?.querySelector('[data-button="scroll-top"]') || null;
    return content;
  }
  async mount() {
    this.scrollTopBtn?.addEventListener("click", this.scrollTopBtnClickHandler);
    layouts["main-layout"]?.listen?.(ScrollEventType, this.windowScrollHandler);
  }
  async unmount() {
    this.scrollTopBtn?.removeEventListener("click", this.scrollTopBtnClickHandler);
    layouts["main-layout"]?.unlisten?.(ScrollEventType, this.windowScrollHandler);
  }
  async load(lang, page, firstLoad) {
    layouts["main-layout"]?.performAction?.(ScrollActionTo, {
      top: this.currScroll,
      noSmooth: true
    });
  }
};
var HomePage = _HomePage;
__publicField(HomePage, "page", null);
export {
  HomePage
};
//# sourceMappingURL=home-page.js.map

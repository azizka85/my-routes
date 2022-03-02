import { View } from '../view';

export class LoaderPage implements View {
  protected static page: LoaderPage | null = null;

  protected node: HTMLElement | null = null;

  static get instance(): LoaderPage {
    if(!LoaderPage.page) {
      LoaderPage.page = new LoaderPage();
    }

    return LoaderPage.page;
  }

  get elem(): HTMLElement | null {
    return this.node;
  }

  async init(parent: HTMLElement | null, firstTime: boolean) {
    let content = parent || document.body;

    this.node = content.querySelector('[data-page="loader-page"]');

    return content;
  }
}

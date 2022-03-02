import { BaseLayout } from "./base-layout";

export class DefaultLayout extends BaseLayout {
  protected static layout: DefaultLayout | null = null;    

  static get instance(): DefaultLayout {
    if(!DefaultLayout.layout) {
      DefaultLayout.layout = new DefaultLayout();
    }

    return DefaultLayout.layout;
  }
}

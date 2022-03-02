import { View } from "../view";

import { mount, unmount } from '../../helpers';

export class BaseLayout {
  protected content: View | null = null;

  async replaceContent(content: View) {
    if(this.content?.replaceSelf) {
      this.content.replaceSelf(content);
    } else {
      await this.content?.unmount?.();
      await unmount(this.content?.elem || null);

      this.content?.elem?.replaceWith(content.elem || '');
      
      await content.mount?.();
      await mount(content.elem);
    }

    this.content = content;
  }
}

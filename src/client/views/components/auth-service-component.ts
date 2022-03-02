import { Page } from '@azizka/router';

import { Component, View } from '../view';

import { context } from '../../globals';

import { DEFAULT_LANGUAGE } from '../../../globals';

export class AuthServiceComponent implements Component {
  protected titleElem: HTMLElement | null = null;

  protected githubBtn: HTMLElement | null = null;

  async init(view: View, firstTime: boolean) {
    this.titleElem = view.elem?.querySelector('[data-title="auth-service"]') || null;

    this.githubBtn = view.elem?.querySelector('[data-button="auth-service-github"]') || null;
  }
  
  async load(lang: string, page: Page, firstLoad: boolean) {
    if(this.titleElem) {
      this.titleElem.textContent = context.tr('Or use the service');
    }

    const langQuery = lang === DEFAULT_LANGUAGE ? '' : `?lang=${lang}`;

    if(this.githubBtn) {
      this.githubBtn.setAttribute('href', `/auth/service/github${langQuery}`);
    }
  }
}

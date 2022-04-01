import { Page } from '@azizka/router';

import { View } from '../view';

import { AuthServiceComponent } from '../components/auth-service-component';

import { Result, ResultStatus } from '../../../data/result';

import { loadContent, navigateHandler } from '../../helpers';

import { context, routeNavigator } from '../../globals';
import { DEFAULT_LANGUAGE } from '../../../globals';

export class SignUpPage implements View {
  protected static page: SignUpPage | null = null;

  protected lang: string = DEFAULT_LANGUAGE;

  protected node: HTMLElement | null = null;

  protected titleElem: HTMLElement | null = null;

  protected emailInputElem: HTMLInputElement | null = null;

  protected nameInputElem: HTMLInputElement | null = null;
  protected nameLabelElem: HTMLElement | null = null;

  protected passwordInputElem: HTMLInputElement | null = null;
  protected passwordLabelElem: HTMLElement | null = null;

  protected photoInputElem: HTMLInputElement | null = null;
  protected photoLabelElem: HTMLElement | null = null;

  protected signInBtn: HTMLElement | null = null;
  protected signUpBtn: HTMLElement | null = null;
  protected cancelBtn: HTMLElement | null = null;

  protected authService: AuthServiceComponent | null = null;

  protected signInBtnClickHandler: (event: MouseEvent) => void;
  protected cancelBtnClickHandler: (event: MouseEvent) => void;

  protected formSubmitHandler: (event: SubmitEvent) => void;

  static get instance(): SignUpPage {
    if(!SignUpPage.page) {
      SignUpPage.page = new SignUpPage();
    }

    return SignUpPage.page;
  }

  constructor() {
    this.formSubmitHandler = async (event) => {
      event.preventDefault();

      const form = this.node?.querySelector('.main-card form') as HTMLFormElement;
      const data = new FormData(form as HTMLFormElement);
      
      const params = new URLSearchParams();

      data.forEach((value, key) => {
        params.append(key, value.toString());         
      });

      try {
        const response = await fetch(`${location.pathname}?ajax=1`, {
          method: 'post',
          body: params
        });
        
        if(response.status === 200) {
          const resData = await response.json() as Result;
  
          if(resData.status === ResultStatus.OK) {
            routeNavigator.redirectTo(
              (this.lang === DEFAULT_LANGUAGE ? '' : `/${this.lang}`) + '/'
            );
          } else {
            console.error(resData.data);          
          }
        }
      } finally {

      }
    };

    this.signInBtnClickHandler = event => navigateHandler(event, this.signInBtn as HTMLElement);
    this.cancelBtnClickHandler = event => navigateHandler(event, this.cancelBtn as HTMLElement);
  }

  get elem(): HTMLElement | null {
    return this.node;
  }

  async init(parent: HTMLElement | null, firstTime: boolean) {
    let content = await loadContent(parent, firstTime, []);

    this.node = content.querySelector('[data-page="signup-page"]') || null;

    const form = this.node?.querySelector('.main-card form') as HTMLFormElement;

    this.titleElem = this.node?.querySelector('[data-title="main"]') || null;

    this.emailInputElem = form?.querySelector('#email') || null;

    this.nameInputElem = form?.querySelector('#full-name') || null;
    this.nameLabelElem = form?.querySelector('#full-name-label') || null;

    this.passwordInputElem = form?.querySelector('#password') || null;
    this.passwordLabelElem = form?.querySelector('#password-label') || null;

    this.photoInputElem = form?.querySelector('#photo') || null;
    this.photoLabelElem = form?.querySelector('#photo-label') || null;

    this.signInBtn = form?.querySelector('[data-button="sign-in"]') || null;    
    this.signUpBtn = form?.querySelector('[data-button="sign-up"]') || null;
    this.cancelBtn = form?.querySelector('[data-button="cancel"]') || null;    

    this.authService = new AuthServiceComponent();
    await this.authService.init(this, firstTime);

    return content;
  }

  async mount() {
    const form = this.node?.querySelector('.main-card form') as HTMLFormElement;

    form?.addEventListener('submit', this.formSubmitHandler);
    this.signInBtn?.addEventListener('click', this.signInBtnClickHandler);
    this.cancelBtn?.addEventListener('click', this.cancelBtnClickHandler);
  }

  async unmount() {
    const form = this.node?.querySelector('.main-card form') as HTMLFormElement;

    form?.removeEventListener('submit', this.formSubmitHandler);
    this.signInBtn?.removeEventListener('click', this.signInBtnClickHandler);
    this.cancelBtn?.removeEventListener('click', this.cancelBtnClickHandler);
  }

  async load(lang: string, page: Page, firstLoad: boolean): Promise<void> {
    this.lang = lang;

    if(this.titleElem) {
      this.titleElem.textContent = context.tr('Sign Up');
    }

    if(this.nameInputElem) {
      this.nameInputElem.placeholder = context.tr('Name') + '*';
    }

    if(this.nameLabelElem) {
      this.nameLabelElem.textContent = context.tr('Name') + '*';
    }

    if(this.passwordInputElem) {
      this.passwordInputElem.placeholder = context.tr('Password') + '*';
    }

    if(this.passwordLabelElem) {
      this.passwordLabelElem.textContent = context.tr('Password') + '*';
    }

    if(this.photoLabelElem) {
      this.photoLabelElem.textContent = context.tr('Photo');
    }

    if(this.signInBtn) {
      this.signInBtn.textContent = context.tr('Sign In');
    }

    if(this.signUpBtn) {
      this.signUpBtn.textContent = context.tr('Sign Up');
    }

    if(this.cancelBtn) {
      this.cancelBtn.textContent = context.tr('Cancel');
    }

    this.signInBtn?.setAttribute('href', (lang === DEFAULT_LANGUAGE ? '' : `/${lang}`) + '/sign-in');
    this.cancelBtn?.setAttribute('href', (lang === DEFAULT_LANGUAGE ? '' : `/${lang}`) + '/');

    await this.authService?.load?.(lang, page, firstLoad);
  }
}

import { JSDOM } from 'jsdom';

import { LocationMock } from '@azizka/router';

import { SignInPage } from '../pages/sign-in-page';
import { SignUpPage } from '../pages/sign-up-page';

import { DefaultLayout } from './default-layout';

import { fetchMock } from '../../mocks/fetch-mock';

describe('DefaultLayout test', () => {
  beforeEach(() => {
    const dom = new JSDOM();

    global.document = dom.window.document;

    global.location = (new LocationMock() as unknown) as Location;

    global.fetch = req => (fetchMock((req as unknown) as string) as unknown) as Promise<Response>;
  });

  test('Should get single instance of DefaultLayout', () => {
    const instance = DefaultLayout.instance;
    
    expect(instance).toBeTruthy();
    expect(instance).toBeInstanceOf(DefaultLayout);
    expect(instance).toBe(DefaultLayout.instance);
  });

  test('Should replace content correctly', async () => {
    const instance = DefaultLayout.instance;

    const signInPage = SignInPage.instance;
    const signUpPage = SignUpPage.instance;

    await signInPage.init(null, false);
    await signUpPage.init(null, false);

    await instance.replaceContent(signInPage)

    expect(instance['content']).toBe(signInPage);

    await instance.replaceContent(signUpPage);

    expect(instance['content']).toBe(signUpPage);
  });
});


import { Translator } from "@azizka/i18n";

import knex from "../db/knex";
import { generateMD5Hash } from '../db/helpers';

import { DBResult, DBResultStatus } from "../data/db-result";
import { Session } from "../data/session";

import locales from './locale-helpers';

export async function emailExist(email: string): Promise<boolean> {
  const row = await knex('user')
    .where('email', email)
    .first('id');

  return row && row.id > 0;
}

export async function signIn(
  email: string, 
  password: string, 
  lang: string, 
  session: Session
) {
  const translator = lang in locales ? locales[lang] : new Translator();

  const result: DBResult = {
    status: DBResultStatus.OK
  };

  try {
    const row = await knex('user')      
      .where('email', email)
      .andWhere('password', generateMD5Hash(password))
      .first('id');

    if(!row?.id) {
      result.status = DBResultStatus.Error;
      result.data = translator.translate("User with this email and password doesn't exist");
    } else {      
      session.userId = row.id;
      session.service = null;
    }
  } catch(err) {
    console.error(err);    

    result.status = DBResultStatus.Error;
    result.data = (err as Error)?.message || err;
  }

  return result;
}

export async function signUp(
  name: string, 
  email: string, 
  password: string, 
  photo: string,
  lang: string, 
  session: Session
) {
  const translator = lang in locales ? locales[lang] : new Translator();

  let result: DBResult = {
    status: DBResultStatus.OK
  };

  try {
    const exist = await emailExist(email);
    if(exist) {
      result.status = DBResultStatus.Error;
      result.data = translator.translate('User with this email already exists');
    } else {
      await knex('user')
        .insert({
          full_name: name,
          email,
          password: generateMD5Hash(password),
          photo,
          created_at: Date.now(),
          updated_at: Date.now()
        });

      result = await signIn(email, password, lang, session);
    }
  } catch(err) {
    console.error(err);    

    result.status = DBResultStatus.Error;
    result.data = (err as Error)?.message || err;
  }

  return result;
}

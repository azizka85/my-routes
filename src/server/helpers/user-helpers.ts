import { Translator } from "@azizka/i18n";

import knex from "../db/knex";
import { generateMD5Hash } from '../db/helpers';

import { Result, ResultStatus } from "../../data/result";
import { User } from "../../data/user";
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

  const result: Result = {
    status: ResultStatus.OK
  };

  try {
    const row = await knex('user')      
      .where('email', email)
      .andWhere('password', generateMD5Hash(password))
      .first('id');

    if(!row?.id) {
      result.status = ResultStatus.Error;
      result.data = translator.translate("User with this email and password doesn't exist");
    } else {      
      session.userId = row.id;
      session.service = null;
    }
  } catch(err) {
    console.error(err);    

    result.status = ResultStatus.Error;
    result.data = (err as Error)?.message || err;
  }

  return result;
}

export async function signUp(
  user: User,
  lang: string, 
  session: Session
) {
  const translator = lang in locales ? locales[lang] : new Translator();

  let result: Result = {
    status: ResultStatus.OK
  };

  if(!user.fullName) {
    result.status = ResultStatus.Error;
    result.data = translator.translate('Name required');
  } else if(!user.email) {
    result.status = ResultStatus.Error;
    result.data = translator.translate('Email required');
  } else if(!user.password) {
    result.status = ResultStatus.Error;
    result.data = translator.translate('Password required');
  } else {
    try {
      const exist = await emailExist(user.email);
      if(exist) {
        result.status = ResultStatus.Error;
        result.data = translator.translate('User with this email already exists');
      } else {
        user.createdAt = Date.now();
        user.updatedAt = Date.now();

        await knex<User>('user').insert({
          ...user,
          password: generateMD5Hash(user.password)
        });
  
        result = await signIn(user.email, user.password, lang, session);
      }
    } catch(err) {
      console.error(err);    
  
      result.status = ResultStatus.Error;
      result.data = (err as Error)?.message || err;
    }
  }  

  return result;
}

import { Translator } from "@azizka/i18n";

import knex from "../db/knex";
import { generateMD5Hash } from '../db/helpers';

import { Result, ResultStatus } from "../../data/result";
import { User } from "../../data/user";
import { Session } from "../data/session";
import { Github } from '../data/github';

import locales from './locale-helpers';

export async function getUserIdByEmail(email: string): Promise<number | undefined> {
  const row = await knex('user')
    .where('email', email)
    .first('id');

  return row?.id;
}

export async function emailExist(email: string): Promise<boolean> {
  const userId = await getUserIdByEmail(email);

  return !!userId;
}

export async function getUserInfoById(userId: number | null) {
  if(userId) {
    return await knex<User>('user')
      .where('id', userId)
      .first('fullName', 'photo')
  }
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
    const row = await knex<User>('user')      
      .where('email', email)
      .andWhere('password', generateMD5Hash(password))
      .first('id', 'photo', 'fullName');

    if(!row) {
      result.status = ResultStatus.Error;
      result.data = translator.translate("User with this email and password doesn't exist");
    } else {      
      result.data = row;

      session.userId = row.id || null;
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

export async function getUserInfoFromSession(session: Session) {
  if(session.service) {
    switch(session.service) {
      case 'github': 
        return getUserInfoFromGithub(session.data['oauthGithub']);
    }
  } else {
    return await getUserInfoById(session.userId);
  }
}

export function getUserInfoFromGithub(githubData?: Github) {
  if(githubData) {
    return {
      fullName: githubData.user?.name,
      photo: githubData.user?.avatar_url
    } as Pick<User, "fullName" | "photo">;
  }
}

import knex from '../db/knex';

import { Session } from '../data/session';

export async function clearExpiredSessions() {
  try {
    await knex('session')
      .where('createdAt', '<=', Date.now() - 24*3600*1000)
      .del();
  } catch(err) {
    console.error(err);    
  }
}

export async function getSession(sessionId: string) {
  const session: Session = {
    id: sessionId,
    data: {},
    userId: null,
    service: null,
    createdAt: Date.now()    
  };

  try {
    const row = await knex('session')
      .where('token', sessionId)
      .first('data', 'userId', 'service', 'createdAt');

    session.data = JSON.parse(row.data);
    session.userId = row.userId;
    session.service = row.service;
    session.createdAt = row.createdAt;
  } catch(err) { 
    console.error(err);    
  }

  return session;
}

export async function sessionExist(sessionId: string) {
  try {
    const row = await knex('session')
      .count('*', {as: 'cnt'})
      .where('token', sessionId)
      .first();

    return row && row.cnt > 0;
  } catch(err) {
    console.error(err);  
  }

  return false;
}

export async function setSession(session: Session) {
  try {
    const exist = await sessionExist(session.id);

    if(exist) {
      await knex('session')
        .where('token', session.id)
        .update({
          data: JSON.stringify(session.data),
          userId: session.userId,
          service: session.service,
          createdAt: Date.now()
        });
    } else {
      await knex('session')
        .insert({
          token: session.id,
          data: JSON.stringify(session.data),
          userId: session.userId,
          service: session.service,
          createdAt: Date.now()          
        });
    }
  } catch(err) {
    console.error(err);    
  }
}

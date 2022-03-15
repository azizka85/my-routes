import knex from '../db/knex';

import { Session } from '../data/session';

export async function clearExpiredSessions() {
  try {
    await knex('session')
      .where('created_at', '<=', Date.now() - 24*3600*1000)
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
      .first('data', 'user_id', 'service', 'created_at');

    session.data = JSON.parse(row.data);
    session.userId = row.user_id;
    session.service = row.service;
    session.createdAt = row.created_at;
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
          user_id: session.userId,
          service: session.service,
          created_at: Date.now()
        });
    } else {
      await knex('session')
        .insert({
          token: session.id,
          data: JSON.stringify(session.data),
          user_id: session.userId,
          service: session.service,
          created_at: Date.now()          
        });
    }
  } catch(err) {
    console.error(err);    
  }
}

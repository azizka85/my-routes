import knex from '../db/knex';

export async function clearExpiredSessions() {
  try {
    await knex('session')
      .where('created_at', '<=', Date.now() - 24*3600*1000)
      .del();
  } catch(err) {
    console.error(err);    
  }
}

export async function getSessionData(sessionId: string) {
  try {
    const row = await knex('session')
      .where('token', sessionId)
      .first('data');

    return JSON.parse(row.data);
  } catch(err) { 
    console.error(err);    
  }

  return {};
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

export async function setSessionData(sessionId: string, data: any) {
  try {
    const exist = await sessionExist(sessionId);

    if(exist) {
      await knex('session')
        .where('token', sessionId)
        .update({
          data: JSON.stringify(data),
          created_at: Date.now()
        });
    } else {
      await knex('session')
        .insert({
          token: sessionId,
          data: JSON.stringify(data),
          created_at: Date.now()          
        });
    }
  } catch(err) {
    console.error(err);    
  }
}

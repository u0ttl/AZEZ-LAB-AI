import crypto from "crypto";
const sessions=new Map();
export function createSession({userId,organizationId,ttlMs=8*60*60*1000}){
 const id=crypto.randomUUID(),now=Date.now();
 const row={id,userId,organizationId,createdAt:new Date(now).toISOString(),expiresAt:new Date(now+ttlMs).toISOString(),revokedAt:null};
 sessions.set(id,row);return row;
}
export function getActiveSession(id){
 const s=sessions.get(id);if(!s||s.revokedAt||Date.parse(s.expiresAt)<=Date.now())return null;return s;
}
export function revokeSession(id){const s=sessions.get(id);if(!s)return false;s.revokedAt=new Date().toISOString();return true}
export function revokeUserSessions(userId){let n=0;for(const s of sessions.values())if(s.userId===userId&&!s.revokedAt){s.revokedAt=new Date().toISOString();n++}return n}

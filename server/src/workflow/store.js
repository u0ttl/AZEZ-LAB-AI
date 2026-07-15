const states=new Map(),reviews=[],acks=[],locks=new Map(),assignments=[];
export const workflowStore={
 ensure(id){if(!states.has(id))states.set(id,{status:"READY"});return states.get(id)},
 setStatus(id,status){const s={...this.ensure(id),status,updatedAt:new Date().toISOString()};states.set(id,s);return s},
 addReview(r){const x={id:`REV-${Date.now()}`,...r,createdAt:new Date().toISOString()};reviews.push(x);return x},
 reviewsFor(id){return reviews.filter(x=>x.caseId===id)},
 acknowledge(x){if(acks.some(a=>a.caseId===x.caseId&&a.signalKey===x.signalKey))return null;const a={id:`ACK-${Date.now()}`,...x,acknowledgedAt:new Date().toISOString()};acks.push(a);return a},
 acksFor(id){return acks.filter(x=>x.caseId===id)},
 lock(caseId,userId,minutes=15){const current=locks.get(caseId);if(current&&new Date(current.expiresAt)>new Date()&&current.userId!==userId)return{ok:false,lock:current};const lock={caseId,userId,expiresAt:new Date(Date.now()+minutes*60000).toISOString()};locks.set(caseId,lock);return{ok:true,lock}},
 unlock(caseId,userId){const l=locks.get(caseId);if(l&&l.userId!==userId)return false;locks.delete(caseId);return true},
 getLock(id){const l=locks.get(id);if(l&&new Date(l.expiresAt)<=new Date()){locks.delete(id);return null}return l||null},
 assign(caseId,userId,assignedBy){if(!assignments.some(x=>x.caseId===caseId&&x.userId===userId))assignments.push({caseId,userId,assignedBy,createdAt:new Date().toISOString()});return assignments.filter(x=>x.caseId===caseId)}
};
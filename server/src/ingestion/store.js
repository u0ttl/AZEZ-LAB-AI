const jobs=new Map();
export const ingestionStore={
 create(data){const id=`ING-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;const job={id,createdAt:new Date().toISOString(),...data};jobs.set(id,job);return job},
 get(id){return jobs.get(id)||null},
 list(){return[...jobs.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt))},
 update(id,patch){const j=jobs.get(id);if(!j)return null;const n={...j,...patch,updatedAt:new Date().toISOString()};jobs.set(id,n);return n}
};
const sets=new Map(),criticalPolicies=new Map();
export function addReferenceSet(input){
 const required=["testCode","unit","lower","upper","context","version","reviewStatus"];
 for(const k of required)if(input[k]===undefined||input[k]===null)throw new Error(`REFERENCE_${k.toUpperCase()}_REQUIRED`);
 const id=input.id||`REF-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
 const row={id,...input,createdAt:new Date().toISOString()};sets.set(id,row);return row;
}
export function resolveReferenceSet({testCode,unit,context={}}){
 const candidates=[...sets.values()].filter(x=>x.testCode===testCode&&x.unit===unit&&x.reviewStatus==="APPROVED");
 const score=x=>{
  let s=0;
  for(const key of ["sex","ageMin","ageMax","specimen","fasting"]){
   if(x.context?.[key]===undefined)continue;
   if(key==="ageMin"&&context.age>=x.context.ageMin)s++;
   else if(key==="ageMax"&&context.age<=x.context.ageMax)s++;
   else if(x.context[key]===context[key])s++;
   else return -999;
  }
  return s;
 };
 return candidates.map(x=>({x,score:score(x)})).filter(y=>y.score>=0).sort((a,b)=>b.score-a.score)[0]?.x||null;
}
export function addCriticalPolicy(input){
 if(!input.testCode||!input.unit||(!Number.isFinite(input.low)&&!Number.isFinite(input.high)))throw new Error("CRITICAL_POLICY_INVALID");
 const id=input.id||`CRIT-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
 const row={id,...input,createdAt:new Date().toISOString()};criticalPolicies.set(id,row);return row;
}
export function evaluateCritical({testCode,value,unit,organizationCode}){
 const n=Number(value);if(!Number.isFinite(n))return[];
 return[...criticalPolicies.values()].filter(x=>x.active!==false&&x.testCode===testCode&&x.unit===unit&&(!x.organizationCode||x.organizationCode===organizationCode)).flatMap(x=>{
  const hits=[];if(Number.isFinite(x.low)&&n<=x.low)hits.push({policyId:x.id,direction:"LOW",threshold:x.low,severity:x.severity||"CRITICAL"});
  if(Number.isFinite(x.high)&&n>=x.high)hits.push({policyId:x.id,direction:"HIGH",threshold:x.high,severity:x.severity||"CRITICAL"});return hits;
 });
}
export const referenceStore={list:()=>[...sets.values()],criticalPolicies:()=>[...criticalPolicies.values()]};

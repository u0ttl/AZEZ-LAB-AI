import crypto from"crypto";import{parseHL7v2}from"./hl7.js";import{mapFHIRBundle}from"./fhir.js";import{resolveTest}from"../registry.js";
const messages=new Map(),deadLetters=[],reconciliation=[];
export function hashPayload(payload){return crypto.createHash("sha256").update(typeof payload==="string"?payload:JSON.stringify(payload)).digest("hex")}
export function processIntegration({protocol,payload,idempotencyKey,sourceCode="UNREGISTERED",organizationCode="DEMO"}){
 const key=`${organizationCode}:${idempotencyKey}`;
 if(messages.has(key))return{duplicate:true,message:messages.get(key)};
 const payloadHash=hashPayload(payload);
 const message={id:`MSG-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,organizationCode,sourceCode,protocol,idempotencyKey,payloadHash,status:"RECEIVED",receivedAt:new Date().toISOString()};
 messages.set(key,message);
 try{
  const parsed=protocol==="HL7_V2"?parseHL7v2(payload):protocol==="FHIR_R4"?mapFHIRBundle(payload):(()=>{throw new Error("PROTOCOL_NOT_SUPPORTED")})();
  const observations=(parsed.observations||[]).map((o,index)=>{
   const test=resolveTest(o.sourceTestCode);
   return{...o,canonicalCode:test?.code||null,mappingStatus:test?"MAPPED":"UNMAPPED",integrationEvidenceId:`INT-EV-${String(index+1).padStart(4,"0")}`}
  });
  const unmapped=observations.filter(o=>o.mappingStatus==="UNMAPPED");
  const updated={...message,status:unmapped.length?"RECONCILIATION_REQUIRED":"MAPPED",parsed:{...parsed,observations},processedAt:new Date().toISOString()};
  messages.set(key,updated);
  if(unmapped.length)reconciliation.push({id:`REC-${Date.now()}`,messageKey:key,reason:"UNMAPPED_TEST_CODES",codes:unmapped.map(x=>x.sourceTestCode),status:"OPEN",createdAt:new Date().toISOString()});
  return{duplicate:false,message:updated};
 }catch(e){
  const failed={...message,status:"DEAD_LETTER",error:{message:e.message},processedAt:new Date().toISOString()};messages.set(key,failed);
  deadLetters.push({id:`DLQ-${Date.now()}`,messageKey:key,reason:e.message,payloadHash,attempts:0,resolved:false,createdAt:new Date().toISOString()});
  return{duplicate:false,message:failed};
 }
}
export const integrationStore={
 listMessages:()=>[...messages.values()].sort((a,b)=>b.receivedAt.localeCompare(a.receivedAt)),
 deadLetters:()=>deadLetters,
 reconciliation:()=>reconciliation,
 resolveReconciliation(id,mapping){const item=reconciliation.find(x=>x.id===id);if(!item)return null;item.status="RESOLVED";item.mapping=mapping;item.resolvedAt=new Date().toISOString();return item}
};
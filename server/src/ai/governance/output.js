import { z } from "zod";

export const AiOutputSchema=z.object({
 summary:z.string().min(1).max(4000),
 observations:z.array(z.object({
  statement:z.string().min(1).max(1200),
  evidenceIds:z.array(z.string().min(1)).min(1),
  category:z.enum(["PATTERN_OBSERVATION","POSSIBLE_ASSOCIATION","VERIFICATION_CONSIDERATION"])
 })).max(30),
 differentialConsiderations:z.array(z.object({
  consideration:z.string().min(1).max(1000),
  evidenceIds:z.array(z.string().min(1)).min(1)
 })).max(20),
 verificationConsiderations:z.array(z.object({
  action:z.string().min(1).max(1000),
  evidenceIds:z.array(z.string().min(1)).min(1)
 })).max(20),
 limitations:z.array(z.string().min(1).max(800)).max(20),
 safetyStatement:z.string().min(1).max(1200)
});

export function validateEvidenceLinks(output,allowedEvidenceIds){
 const allowed=new Set(allowedEvidenceIds);
 const invalid=[];
 const scan=(items,key)=>items.forEach((item,index)=>(item.evidenceIds||[]).forEach(id=>{if(!allowed.has(id))invalid.push({key,index,evidenceId:id})}));
 scan(output.observations||[],"observations");
 scan(output.differentialConsiderations||[],"differentialConsiderations");
 scan(output.verificationConsiderations||[],"verificationConsiderations");
 return{ok:invalid.length===0,invalid};
}

const forbiddenConfirmed=[
 /\bconfirmed diagnosis\b/i,/\bdefinitive diagnosis\b/i,/\bpatient has\b/i,
 /\bdiagnosed with\b/i,/\bconfirms? (?:the )?(?:diagnosis|disease)\b/i
];
export function validateSafetyLanguage(output){
 const text=JSON.stringify(output);
 const violations=forbiddenConfirmed.filter(r=>r.test(text)).map(r=>r.source);
 return{ok:violations.length===0,violations};
}

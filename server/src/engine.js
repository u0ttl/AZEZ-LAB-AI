const codeMap=rows=>Object.fromEntries(rows.map(r=>[r.testCode.toUpperCase(),r]));
const low=r=>r?.flag==="LOW"||r?.flag==="CRITICAL_LOW";
const high=r=>r?.flag==="HIGH"||r?.flag==="CRITICAL_HIGH";

export function analyzeLaboratoryCase(input){
 const rows=input.results, m=codeMap(rows), signals=[];
 if(low(m.HGB)&&low(m.MCV)&&low(m.MCH)){
   signals.push({
    id:"CBC_MICRO_HYPO",
    discipline:"HEMATOLOGY",
    strength:high(m.RDW)?"HIGH":"MODERATE",
    observation:"Low HGB with reduced MCV and MCH forms a microcytic / hypochromic index pattern"+(high(m.RDW)?" with elevated RDW.":"."),
    associations:["This laboratory index pattern may occur in multiple clinical and laboratory contexts."],
    verify:["Correlate with laboratory history and qualified professional review.","Consider appropriate follow-up testing according to local protocols and the care team."]
   });
 }
 return {
  measured:rows.map(r=>({testCode:r.testCode,value:r.valueText,unit:r.unit,flag:r.flag,reference:{low:r.referenceLow,high:r.referenceHigh}})),
  patterns:signals.map(s=>({id:s.id,discipline:s.discipline,strength:s.strength,observation:s.observation})),
  associations:signals.flatMap(s=>s.associations.map(text=>({patternId:s.id,text,disclaimer:"Possible association; not a confirmed diagnosis."}))),
  verify:signals.flatMap(s=>s.verify.map(text=>({patternId:s.id,text}))),
  safety:{diagnosisConfirmed:false,professionalReviewRequired:true,separationEnforced:true},
  engine:{name:"AZEZ LAB deterministic pattern engine",version:"0.1.0"}
 };
}
function evidenceIdsFor(pattern,evidence){
 const wanted=pattern.id==="CBC_MICRO_HYPO"?["HGB","MCV","MCH","RDW"]:[];
 return evidence.filter(e=>wanted.includes(e.canonicalCode)).map(e=>e.evidenceId);
}

export async function generateWithProvider({evidence,patterns,prompt}){
 const provider=(process.env.AI_PROVIDER||"mock").toLowerCase();
 if(provider!=="mock"){
   throw new Error(`AI_PROVIDER_${provider.toUpperCase()}_NOT_CONFIGURED_IN_V8`);
 }
 const p=patterns[0],ids=p?evidenceIdsFor(p,evidence):evidence.map(e=>e.evidenceId).slice(0,4);
 if(!p){
  return{
   provider:"mock",model:"azez-structured-demo-v1",
   output:{
    summary:"No deterministic laboratory pattern signal was produced for this demonstration case.",
    observations:[],
    possibleAssociations:[],
    verificationConsiderations:[{text:"Review the measured laboratory evidence in the appropriate professional context.",evidenceIds:evidence.slice(0,1).map(e=>e.evidenceId)}],
    criticalSignals:[],
    safety:{confirmedDiagnosis:false,professionalReviewRequired:true,measuredFactsMutable:false}
   }
  };
 }
 return{
  provider:"mock",model:"azez-structured-demo-v1",
  output:{
   summary:"The verified CBC evidence contains a correlated red-cell index pattern that requires professional contextual review.",
   observations:[{text:p.observation,evidenceIds:ids}],
   possibleAssociations:[{text:"The observed index combination may occur in multiple laboratory and clinical contexts.",evidenceIds:ids,disclaimer:"Possible association; not a confirmed diagnosis."}],
   verificationConsiderations:[{text:"Correlate the pattern with laboratory history and follow-up testing selected by the qualified care team.",evidenceIds:ids}],
   criticalSignals:[],
   safety:{confirmedDiagnosis:false,professionalReviewRequired:true,measuredFactsMutable:false}
  }
 };
}

import{resolveTest}from"../registry.js";
export function scoreAndResolve(fields){
 return fields.map(f=>{
  const test=resolveTest(f.sourceTestCode);
  const numeric=Number(String(f.sourceValue).replace(",","."));
  let confidence=.35;
  if(test)confidence+=.35;
  if(Number.isFinite(numeric))confidence+=.2;
  if(f.sourceUnit)confidence+=.05;
  confidence=Math.min(.95,confidence);
  const reasons=[];
  if(!test)reasons.push("UNKNOWN_TEST");
  if(!Number.isFinite(numeric))reasons.push("NON_NUMERIC_VALUE");
  if(!f.sourceUnit)reasons.push("UNIT_MISSING");
  return{...f,canonicalCode:test?.code||null,numericValue:Number.isFinite(numeric)?numeric:null,confidence:Number(confidence.toFixed(2)),verificationStatus:confidence>=.85&&test&&Number.isFinite(numeric)?"ACCEPTED":"PENDING",verificationReasons:reasons};
 });
}
export function buildVerificationQueue(fields){
 return fields.filter(f=>f.verificationStatus!=="ACCEPTED").map(f=>({rowIndex:f.rowIndex,sourceTestCode:f.sourceTestCode,sourceValue:f.sourceValue,sourceUnit:f.sourceUnit,canonicalCode:f.canonicalCode,confidence:f.confidence,reasons:f.verificationReasons,provenance:f.provenance}));
}
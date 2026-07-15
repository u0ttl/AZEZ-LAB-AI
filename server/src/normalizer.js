import{resolveTest}from"./registry.js";import{applyReference,calculateFlag}from"./reference.js";
export function normalizeResults(rows){
 return rows.map((r,index)=>{
  const def=resolveTest(r.testCode);
  if(!def)return{error:"UNKNOWN_TEST_CODE",index,sourceCode:r.testCode};
  const numericValue=r.numericValue??Number(r.valueText);
  const base={canonicalCode:def.code,sourceCode:r.testCode,valueText:String(r.valueText),numericValue:Number.isFinite(numericValue)?numericValue:null,unit:r.unit||def.unit,normalizationJson:{resolvedFrom:r.testCode,canonicalName:def.name,discipline:def.discipline}};
  const withRef=applyReference(base);
  return{...withRef,flag:calculateFlag(withRef)}
 })
}
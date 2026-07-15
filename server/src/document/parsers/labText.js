import { resolveTest } from "../../registry.js";

const VALUE=/^[-+]?\d+(?:[.,]\d+)?$/;
const RANGE=/^([-+]?\d+(?:[.,]\d+)?)\s*[-–]\s*([-+]?\d+(?:[.,]\d+)?)$/;

function norm(s){return String(s||"").trim()}
function numeric(s){const n=Number(norm(s).replace(",","."));return Number.isFinite(n)?n:null}

export function parseLaboratoryText(ocr){
 const lines=(ocr.text||"").split(/\r?\n/).map((text,index)=>({text:norm(text),line:index+1})).filter(x=>x.text);
 const fields=[];
 for(const line of lines){
  const tokens=line.text.split(/\s+/).filter(Boolean);
  let testIndex=-1,test=null;
  for(let i=0;i<Math.min(tokens.length,4);i++){
   const candidate=tokens.slice(0,i+1).join(" ");
   const resolved=resolveTest(candidate);
   if(resolved){testIndex=i;test=resolved}
  }
  if(!test)continue;
  const rest=tokens.slice(testIndex+1);
  const valueIndex=rest.findIndex(x=>VALUE.test(x));
  if(valueIndex<0)continue;
  const valueText=rest[valueIndex];
  const after=rest.slice(valueIndex+1);
  const rangeToken=after.find(x=>RANGE.test(x))||null;
  const unit=after.find(x=>x!==rangeToken&&!["H","L","HH","LL","HIGH","LOW"].includes(x.toUpperCase()))||null;
  const flag=after.find(x=>["H","L","HH","LL","HIGH","LOW"].includes(x.toUpperCase()))||null;
  let referenceLow=null,referenceHigh=null;
  if(rangeToken){const m=rangeToken.match(RANGE);referenceLow=numeric(m[1]);referenceHigh=numeric(m[2])}
  const matchingWords=(ocr.pages?.[0]?.words||[]).filter(w=>line.text.includes(w.text));
  const bbox=matchingWords.length?{
   x0:Math.min(...matchingWords.map(w=>w.bbox.x0)),y0:Math.min(...matchingWords.map(w=>w.bbox.y0)),
   x1:Math.max(...matchingWords.map(w=>w.bbox.x1)),y1:Math.max(...matchingWords.map(w=>w.bbox.y1))
  }:null;
  const avgWordConfidence=matchingWords.length?matchingWords.reduce((a,w)=>a+w.confidence,0)/matchingWords.length:ocr.confidence||0;
  let confidence=.35+(test?.code?.length?0.3:0)+(numeric(valueText)!=null?0.2:0)+(unit?0.05:0)+(rangeToken?0.05:0);
  confidence=Math.min(.95,confidence)*Math.max(.5,avgWordConfidence||.5);
  fields.push({
   rowIndex:fields.length+1,sourceTestCode:tokens.slice(0,testIndex+1).join(" "),canonicalCode:test.code,
   sourceValue:valueText,numericValue:numeric(valueText),sourceUnit:unit,sourceReference:rangeToken,
   referenceLow,referenceHigh,sourceFlag:flag,confidence:Number(confidence.toFixed(2)),
   verificationStatus:confidence>=.8?"ACCEPTED":"PENDING",
   verificationReasons:confidence>=.8?[]:["OCR_LOW_CONFIDENCE_OR_INCOMPLETE_CONTEXT"],
   provenance:{adapter:ocr.adapter,page:1,line:line.line,bbox,wordIds:matchingWords.map(w=>w.wordId),ocrConfidence:Number(avgWordConfidence.toFixed(3)),sourceText:line.text}
  });
 }
 return{adapter:"LAB_TEXT_LINE_PARSER_V1",fields,lineCount:lines.length};
}

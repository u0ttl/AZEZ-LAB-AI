function div(a,b){return b?Number((a/b).toFixed(4)):null}
export function extractionMetrics(expected,actual){
 const key=x=>`${x.canonicalCode||x.testCode}|${Number(x.numericValue)}`;
 const E=new Set(expected.map(key)),A=new Set(actual.map(key));
 const tp=[...A].filter(x=>E.has(x)).length;
 const fp=[...A].filter(x=>!E.has(x)).length;
 const fn=[...E].filter(x=>!A.has(x)).length;
 return{
  expected:E.size,actual:A.size,truePositive:tp,falsePositive:fp,falseNegative:fn,
  precision:div(tp,tp+fp),recall:div(tp,tp+fn),f1:(tp&&div(2*tp,2*tp+fp+fn))||0
 };
}
export function verificationMetrics(fields){
 const total=fields.length,pending=fields.filter(x=>x.verificationStatus==="PENDING").length;
 return{total,pending,accepted:total-pending,verificationRate:div(pending,total)};
}
export function aiRunMetrics(runs){
 const total=runs.length,rejected=runs.filter(x=>x.status==="REJECTED").length;
 return{total,rejected,passed:total-rejected,rejectionRate:div(rejected,total)};
}

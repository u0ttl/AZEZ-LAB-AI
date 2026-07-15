export function mapFHIRBundle(resource){
 const entries=resource?.resourceType==="Bundle"?(resource.entry||[]).map(e=>e.resource):[resource];
 const observations=entries.filter(r=>r?.resourceType==="Observation");
 const reports=entries.filter(r=>r?.resourceType==="DiagnosticReport");
 const mapped=observations.map((o,index)=>{
  const coding=o.code?.coding?.[0]||{};
  const q=o.valueQuantity;
  return{
   sourceTestCode:coding.code||o.code?.text||"",
   sourceTestName:coding.display||o.code?.text||null,
   valueText:q?.value!=null?String(q.value):o.valueString||"",
   numericValue:q?.value??null,
   unit:q?.unit||q?.code||null,
   sourceReference:o.referenceRange?.[0]?{
    low:o.referenceRange[0].low?.value??null,
    high:o.referenceRange[0].high?.value??null,
    unit:o.referenceRange[0].low?.unit||o.referenceRange[0].high?.unit||null
   }:null,
   provenance:{resourceType:"Observation",resourceId:o.id||null,index,system:coding.system||null,status:o.status||null}
  }
 });
 return{
  protocol:"FHIR_R4",
  bundleType:resource?.resourceType==="Bundle"?resource.type:null,
  diagnosticReports:reports.map(r=>({id:r.id||null,status:r.status||null,code:r.code?.coding?.[0]?.code||r.code?.text||null})),
  observations:mapped,
  resourceCount:entries.length
 };
}
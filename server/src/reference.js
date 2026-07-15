export const DEMO_REFERENCE_SET={
 name:"AZEZ DEMONSTRATION CBC",version:1,scope:"DEMONSTRATION_ONLY",
 ranges:{
  HGB:{low:12,high:16,unit:"g/dL"},
  MCV:{low:80,high:100,unit:"fL"},
  MCH:{low:27,high:33,unit:"pg"},
  RDW:{low:11.5,high:14.5,unit:"%"},
  WBC:{low:4,high:11,unit:"×10⁹/L"},
  PLT:{low:150,high:450,unit:"×10⁹/L"}
 }
};
export function applyReference(result,set=DEMO_REFERENCE_SET){
 const ref=set.ranges[result.canonicalCode];
 if(!ref)return {...result,referenceLow:null,referenceHigh:null,referenceSource:null};
 return {...result,referenceLow:ref.low,referenceHigh:ref.high,referenceSource:{name:set.name,version:set.version,scope:set.scope}};
}
export function calculateFlag(r){
 if(r.numericValue==null)return"UNKNOWN";
 if(r.criticalLow!=null&&r.numericValue<=r.criticalLow)return"CRITICAL_LOW";
 if(r.criticalHigh!=null&&r.numericValue>=r.criticalHigh)return"CRITICAL_HIGH";
 if(r.referenceLow!=null&&r.numericValue<r.referenceLow)return"LOW";
 if(r.referenceHigh!=null&&r.numericValue>r.referenceHigh)return"HIGH";
 if(r.referenceLow!=null||r.referenceHigh!=null)return"NORMAL";
 return"UNKNOWN";
}
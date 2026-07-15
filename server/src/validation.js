import { z } from "zod";
export const resultSchema=z.object({
 testCode:z.string().min(1).max(32),
 valueText:z.string().min(1).max(64),
 numericValue:z.number().finite().nullable().optional(),
 unit:z.string().max(32).nullable().optional(),
 referenceLow:z.number().finite().nullable().optional(),
 referenceHigh:z.number().finite().nullable().optional()
});
export const caseSchema=z.object({
 externalId:z.string().min(3).max(64),
 displayName:z.string().min(1).max(120),
 specimen:z.string().max(120).nullable().optional(),
 results:z.array(resultSchema).min(1).max(500)
});
export function flagResult(r){
 if(r.numericValue==null)return "UNKNOWN";
 if(r.referenceLow!=null&&r.numericValue<r.referenceLow)return "LOW";
 if(r.referenceHigh!=null&&r.numericValue>r.referenceHigh)return "HIGH";
 if(r.referenceLow!=null||r.referenceHigh!=null)return "NORMAL";
 return "UNKNOWN";
}
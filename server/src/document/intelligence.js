import pdf from "pdf-parse";
import { extractImageText } from "./extractors/ocr.js";
import { parseLaboratoryText } from "./parsers/labText.js";
import { scoreAndResolve,buildVerificationQueue } from "../ingestion/pipeline.js";

export async function processMedicalDocument(file,sourceType){
 let extraction;
 if(sourceType==="image"){
  const ocr=await extractImageText(file.buffer);
  const parsed=parseLaboratoryText(ocr);
  extraction={documentMode:"IMAGE_OCR",ocr,parsed};
 }else if(sourceType==="pdf"){
  const p=await pdf(file.buffer);
  const text=(p.text||"").trim();
  if(!text)return{
   adapter:"PDF_SCANNED_OCR_WORKER_REQUIRED",fields:[],verificationQueue:[],
   status:"NEEDS_VERIFICATION",documentMode:"SCANNED_PDF",requiresPageRendering:true,
   message:"Scanned PDF detected. V12 does not silently promote unread pages to measured facts; page rendering/OCR worker is required."
  };
  const ocr={adapter:"PDF_EMBEDDED_TEXT_V1",text,confidence:1,pages:[{page:1,words:[]}],wordCount:0};
  const parsed=parseLaboratoryText(ocr);
  extraction={documentMode:"PDF_EMBEDDED_TEXT",ocr,parsed,pageCount:p.numpages||null};
 }else throw new Error("DOCUMENT_SOURCE_TYPE_REQUIRED");
 const fields=scoreAndResolve(extraction.parsed.fields).map((f,i)=>({...f,provenance:extraction.parsed.fields[i]?.provenance||f.provenance}));
 const verificationQueue=buildVerificationQueue(fields);
 return{
  adapter:extraction.parsed.adapter,fields,verificationQueue,
  status:verificationQueue.length?"NEEDS_VERIFICATION":"EXTRACTED",
  documentMode:extraction.documentMode,pageCount:extraction.pageCount||1,
  ocrSummary:{adapter:extraction.ocr.adapter,confidence:extraction.ocr.confidence,wordCount:extraction.ocr.wordCount,textPreview:extraction.ocr.text.slice(0,800)}
 };
}

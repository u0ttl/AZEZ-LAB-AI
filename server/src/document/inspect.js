import pdf from "pdf-parse";
import sharp from "sharp";

export async function inspectDocument(file,sourceType){
 if(sourceType==="pdf"){
   const parsed=await pdf(file.buffer);
   const text=(parsed.text||"").trim();
   return{
    adapter:"PDF_TEXT_INSPECTOR_V1",
    pageCount:parsed.numpages||null,
    textAvailable:text.length>0,
    textPreview:text.slice(0,1000),
    ocrRequired:text.length===0,
    extractionMode:text.length?"EMBEDDED_TEXT_REQUIRES_MAPPING":"OCR_REQUIRED"
   };
 }
 if(sourceType==="image"){
   const meta=await sharp(file.buffer).metadata();
   return{
    adapter:"IMAGE_METADATA_INSPECTOR_V1",
    width:meta.width||null,
    height:meta.height||null,
    format:meta.format||null,
    ocrRequired:true,
    extractionMode:"OCR_REQUIRED"
   };
 }
 return null;
}

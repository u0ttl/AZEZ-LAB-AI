import { createWorker } from "tesseract.js";

export async function extractImageText(buffer,{language="eng"}={}){
 const worker=await createWorker(language);
 try{
  const result=await worker.recognize(buffer);
  const words=(result.data.words||[]).map((w,index)=>({
   wordId:`WORD-${String(index+1).padStart(5,"0")}`,
   text:w.text,
   confidence:Number((w.confidence/100).toFixed(3)),
   bbox:{x0:w.bbox.x0,y0:w.bbox.y0,x1:w.bbox.x1,y1:w.bbox.y1},
   page:1
  })).filter(w=>w.text?.trim());
  return{
   adapter:"TESSERACT_IMAGE_OCR_V1",
   text:result.data.text||"",
   confidence:Number(((result.data.confidence||0)/100).toFixed(3)),
   pages:[{page:1,width:null,height:null,words}],
   wordCount:words.length
  };
 }finally{await worker.terminate()}
}

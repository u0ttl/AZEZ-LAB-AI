import crypto from"crypto";
const ALLOWED=new Map([
 ["text/csv","csv"],["application/vnd.ms-excel","csv"],
 ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","xlsx"],
 ["application/pdf","pdf"],["image/png","image"],["image/jpeg","image"]
]);
const MAX=10*1024*1024;
export function inspectFile(file){
 const reasons=[];
 if(!file)reasons.push("FILE_MISSING");
 if(file?.size>MAX)reasons.push("FILE_TOO_LARGE");
 const sourceType=ALLOWED.get(file?.mimetype);
 if(file&&!sourceType)reasons.push("MIME_NOT_ALLOWED");
 const sha256=file?crypto.createHash("sha256").update(file.buffer).digest("hex"):null;
 return{accepted:reasons.length===0,reasons,sha256,sourceType,maxBytes:MAX};
}
export const uploadPolicy={allowedMimeTypes:[...ALLOWED.keys()],maxBytes:MAX};
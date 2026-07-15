import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { env } from "../config/env.js";

const root=path.resolve(env.STORAGE_ROOT);
export async function ensureStorage(){await fs.mkdir(root,{recursive:true})}
export async function putObject({buffer,originalName,mimeType}){
 await ensureStorage();
 const sha256=crypto.createHash("sha256").update(buffer).digest("hex");
 const ext=path.extname(originalName||"").toLowerCase().replace(/[^.\w]/g,"").slice(0,10);
 const objectKey=`${sha256.slice(0,2)}/${sha256}${ext}`;
 const target=path.join(root,objectKey);
 await fs.mkdir(path.dirname(target),{recursive:true});
 try{await fs.access(target)}catch{await fs.writeFile(target,buffer,{flag:"wx"})}
 return{objectKey,sha256,sizeBytes:buffer.length,mimeType,originalName};
}
export async function objectExists(objectKey){try{await fs.access(path.join(root,objectKey));return true}catch{return false}}

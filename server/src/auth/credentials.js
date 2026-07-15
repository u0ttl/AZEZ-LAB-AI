import argon2 from "argon2";
export async function hashPassword(password){
 if(typeof password!=="string"||password.length<12)throw new Error("PASSWORD_MIN_12_REQUIRED");
 return argon2.hash(password,{type:argon2.argon2id,memoryCost:19456,timeCost:2,parallelism:1});
}
export async function verifyPassword(hash,password){try{return await argon2.verify(hash,password)}catch{return false}}

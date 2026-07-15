import jwt from"jsonwebtoken";
const SECRET=process.env.JWT_SECRET||"development-only-change-me";
export const demoUsers=[
 {id:"USR-ADMIN",email:"admin@demo.azez",displayName:"Demo Org Admin",role:"ORG_ADMIN",organizationCode:"DEMO"},
 {id:"USR-LAB",email:"lab@demo.azez",displayName:"Lab Specialist",role:"LAB_SPECIALIST",organizationCode:"DEMO"},
 {id:"USR-REVIEW",email:"reviewer@demo.azez",displayName:"Clinical Reviewer",role:"REVIEWER",organizationCode:"DEMO"},
 {id:"USR-READ",email:"read@demo.azez",displayName:"Read Only User",role:"READ_ONLY",organizationCode:"DEMO"}
];
export function issueDemoToken(email){
 const u=demoUsers.find(x=>x.email===email);if(!u)return null;
 return jwt.sign(u,SECRET,{expiresIn:"8h",issuer:"azez-lab-ai"});
}
export function auth(req,res,next){
 const raw=req.headers.authorization||"";const token=raw.startsWith("Bearer ")?raw.slice(7):null;
 if(!token)return res.status(401).json({error:"AUTH_REQUIRED"});
 try{req.user=jwt.verify(token,SECRET,{issuer:"azez-lab-ai"});next()}catch(e){res.status(401).json({error:"INVALID_TOKEN"})}
}
export function allow(...roles){return(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({error:"FORBIDDEN",requiredRoles:roles,currentRole:req.user.role})}

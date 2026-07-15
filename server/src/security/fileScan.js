const blockedExtensions=new Set([".exe",".dll",".bat",".cmd",".ps1",".js",".jar",".scr",".com",".msi"]);
export function preScanFile({originalName="",buffer}){
 const lower=originalName.toLowerCase();
 const ext=lower.includes(".")?lower.slice(lower.lastIndexOf(".")):"";
 if(blockedExtensions.has(ext))return{accepted:false,status:"REJECTED",reason:"EXECUTABLE_EXTENSION_BLOCKED"};
 if(!buffer?.length)return{accepted:false,status:"REJECTED",reason:"EMPTY_FILE"};
 return{accepted:true,status:"PRE_SCAN_PASSED",reason:null,malwareScanStatus:"EXTERNAL_SCANNER_NOT_CONFIGURED"};
}

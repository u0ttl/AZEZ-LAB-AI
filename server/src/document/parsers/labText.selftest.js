import { parseLaboratoryText } from "./labText.js";
const ocr={adapter:"SELFTEST",confidence:.99,text:"HGB 9.8 g/dL 12-16 L\nMCV 68 fL 80-100 L\nMCH 21 pg 27-33 L\nRDW 18.2 % 11.5-14.5 H",pages:[{page:1,words:[]}]};
const out=parseLaboratoryText(ocr);
if(out.fields.length!==4)throw new Error(`EXPECTED_4_FIELDS_GOT_${out.fields.length}`);
if(out.fields[0].canonicalCode!=="HGB")throw new Error("HGB_MAPPING_FAILED");
console.log(JSON.stringify(out,null,2));

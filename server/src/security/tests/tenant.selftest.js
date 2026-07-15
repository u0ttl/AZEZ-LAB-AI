import { assertTenantAccess,tenantScope } from "../tenant.js";
const a={id:"U-A",role:"LAB_SPECIALIST",organizationId:"ORG-A"};
const b={id:"U-B",role:"LAB_SPECIALIST",organizationId:"ORG-B"};
const admin={id:"SYS",role:"SYSTEM_ADMIN"};
if(!assertTenantAccess(a,{organizationId:"ORG-A"}))throw new Error("SAME_TENANT_REJECTED");
let denied=false;try{assertTenantAccess(a,{organizationId:"ORG-B"})}catch(e){denied=e.message==="TENANT_ACCESS_DENIED"}
if(!denied)throw new Error("CROSS_TENANT_ACCESS_ALLOWED");
if(!assertTenantAccess(admin,{organizationId:"ORG-B"}))throw new Error("SYSTEM_ADMIN_REJECTED");
if(tenantScope(b).organizationId!=="ORG-B")throw new Error("TENANT_SCOPE_FAILED");
console.log("TENANT ISOLATION SELFTEST PASSED");

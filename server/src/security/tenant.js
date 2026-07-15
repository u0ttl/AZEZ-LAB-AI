export function assertTenantAccess(user,resource){
 if(!user)throw Object.assign(new Error("AUTH_REQUIRED"),{status:401});
 if(user.role==="SYSTEM_ADMIN")return true;
 const u=user.organizationId||user.organizationCode;
 const r=resource?.organization?.code||resource?.organizationCode||resource?.organizationId;
 if(!u||!r||u!==r)throw Object.assign(new Error("TENANT_ACCESS_DENIED"),{status:403});
 return true;
}
export function tenantScope(user){
 if(user?.role==="SYSTEM_ADMIN")return{};
 const organizationId=user?.organizationId||user?.organizationCode;
 if(!organizationId)throw Object.assign(new Error("TENANT_CONTEXT_REQUIRED"),{status:403});
 return{organizationId};
}

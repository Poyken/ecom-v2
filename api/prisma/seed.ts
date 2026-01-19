
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Roles and Permissions...');

  // 1. Create Permissions
  const permissions = [
    'admin:access',
    'tenant:manage',
    'product:read',
    'product:write',
    'product:delete',
    'order:read',
    'order:write',
    'inventory:read',
    'inventory:write',
    'customer:read',
    'customer:write',
    'promotion:read',
    'promotion:write',
    'loyalty:manage',
    'notification:read',
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm },
      update: {},
      create: { name: perm },
    });
  }

  // 2. Create Roles
  const roles = [
    { name: 'ADMIN', description: 'Platform Administrator' },
    { name: 'OWNER', description: 'Store Owner' },
    { name: 'STAFF', description: 'Store Staff' },
    { name: 'CUSTOMER', description: 'End User' },
  ];

  for (const r of roles) {
    // Only upsert Role if Tenant system allows global roles, but Role belongs to Tenant?
    // In schema: Role @@unique([tenantId, name]).
    // This means Roles are PER TENANT.
    // So we need to seed roles for EACH existing Tenant.
    // Or we must have System Roles?
    // The Schema `model Role` has `tenantId`.
    // So `ADMIN` role must exist in `tenantId: "default"` or similar.
    // BUT User `role` in JWT payload is global? 
    // Wait, UserRole links User to Role.
    // Let's assume for now we seed for the Default Tenant (if exists) or just skip specific data seeding 
    // and focus on structure. 
    
    // HOWEVER, `JwtStrategy` loads permissions. If DB is empty, user has no permissions.
    // We assume user creates tenant and roles are created then?
    // Or we seed for a "Main" tenant.
    
    // Let's check existing Tenants.
    let tenants = await prisma.tenant.findMany();
    if (tenants.length === 0) {
        console.log('No tenants found. Creating default tenant...');
        const tenant = await prisma.tenant.create({
            data: {
                name: 'Poyken Main',
                domain: 'poyken.com',
                subdomain: 'admin',
                plan: 'ENTERPRISE',
            }
        });
        tenants = [tenant];
    }

    for (const tenant of tenants) {
         const roleRecord = await prisma.role.upsert({
            where: { tenantId_name: { tenantId: tenant.id, name: r.name } },
            update: {},
            create: { 
                name: r.name, 
                description: r.description,
                tenantId: tenant.id 
            },
         });

         // 3. Assign Permissions
         // ADMIN/OWNER get ALL permissions
         if (r.name === 'ADMIN' || r.name === 'OWNER') {
             const allPerms = await prisma.permission.findMany();
             for (const p of allPerms) {
                 await prisma.rolePermission.upsert({
                     where: { roleId_permissionId: { roleId: roleRecord.id, permissionId: p.id } },
                     update: {},
                     create: { roleId: roleRecord.id, permissionId: p.id },
                 });
             }
         }
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

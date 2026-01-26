import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { GlobalExceptionFilter } from './../src/common/filters/global-exception.filter';
import { SubscriptionPlan } from './../src/modules/tenant/dto/tenant.dto';

interface MockTenant {
  id: string;
  name: string;
  domain: string;
  subscriptionPlan: string;
  status: string;
}

interface MockUser {
  id: string;
  tenantId: string;
  email: string;
  role: string;
}

interface ApiResponse {
  tenant: {
    id: string;
    name: string;
    domain: string;
    plan: string;
  };
  admin: {
    id: string;
    email: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

describe('Tenant Onboarding (e2e)', () => {
  let app: INestApplication;
  const tenants: MockTenant[] = [];
  const users: MockUser[] = [];

  const mockPrisma = {
    tenant: {
      findUnique: jest
        .fn()
        .mockImplementation((args: { where: { domain: string } }) => {
          return Promise.resolve(
            tenants.find((t) => t.domain === args.where.domain),
          );
        }),
      create: jest.fn().mockImplementation((args: { data: any }) => {
        const data = args.data as Record<string, string>;
        const newTenant: MockTenant = {
          id: 'tenant-uuid-' + tenants.length,
          name: data.name,
          domain: data.domain,
          subscriptionPlan: data.subscriptionPlan,
          status: data.status,
        };
        tenants.push(newTenant);
        return Promise.resolve(newTenant);
      }),
    },
    user: {
      create: jest.fn().mockImplementation((args: { data: any }) => {
        const data = args.data as Record<string, string>;
        const newUser: MockUser = {
          id: 'user-id-' + users.length,
          tenantId: data.tenantId,
          email: data.email,
          role: data.role,
        };
        users.push(newUser);
        return Promise.resolve(newUser);
      }),
    },
    $transaction: jest
      .fn()
      .mockImplementation((cb: (tx: any) => Promise<any>) => cb(mockPrisma)),
  };

  beforeEach(async () => {
    tenants.length = 0;
    users.length = 0;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  it('/tenants/onboard (POST) should onboard a new tenant successfully', async () => {
    const onboardDto = {
      storeName: 'My Awesome Store',
      domain: 'awesome-store',
      plan: SubscriptionPlan.PROFESSIONAL,
      adminEmail: 'admin@awesome.com',
      adminPassword: 'Password123!',
    };

    const httpServer = app.getHttpServer() as string;
    const response = await request(httpServer)
      .post('/api/v1/tenants/onboard')
      .send(onboardDto)
      .expect(201);

    const body = response.body as ApiResponse;
    expect(body.tenant.name).toBe(onboardDto.storeName);
    expect(body.tenant.domain).toBe(onboardDto.domain);
    expect(body.admin.email).toBe(onboardDto.adminEmail);
  });

  it('/tenants/onboard (POST) should fail if domain already exists', async () => {
    const onboardDto = {
      storeName: 'Duplicate Store',
      domain: 'duplicate',
      plan: SubscriptionPlan.STARTER,
      adminEmail: 'admin@duplicate.com',
      adminPassword: 'Password123!',
    };

    const httpServer = app.getHttpServer() as string;
    // First time
    await request(httpServer).post('/api/v1/tenants/onboard').send(onboardDto);

    // Second time
    const response = await request(httpServer)
      .post('/api/v1/tenants/onboard')
      .send(onboardDto)
      .expect(409);

    const body = response.body as ApiResponse;
    expect(body.error?.code).toBe('DOMAIN_ALREADY_EXISTS');
  });

  afterAll(async () => {
    await app.close();
  });
});

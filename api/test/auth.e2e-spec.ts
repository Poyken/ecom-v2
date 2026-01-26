import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { GlobalExceptionFilter } from './../src/common/filters/global-exception.filter';

interface MockUser {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
}

interface ApiResponse {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId?: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  const mockTenantId = '75d8d9b1-7a2e-4e9b-8e3b-9e4b5f6a7b8c';

  const users: MockUser[] = [];
  const mockPrisma = {
    user: {
      findUnique: jest.fn().mockImplementation((args: { where: any }) => {
        const where = args.where as Record<string, any>;
        const tenantEmail = where.tenantId_email as
          | Record<string, string>
          | undefined;

        if (tenantEmail) {
          return Promise.resolve(
            users.find(
              (u) =>
                u.email === tenantEmail.email &&
                u.tenantId === tenantEmail.tenantId,
            ),
          );
        }
        return Promise.resolve(
          users.find((u) => u.email === (where.email as string)),
        );
      }),
      create: jest.fn().mockImplementation((args: { data: any }) => {
        const data = args.data as Record<string, unknown>;
        const newUser: MockUser = {
          id: 'user-id-' + users.length,
          tenantId: data.tenantId as string,
          email: data.email as string,
          passwordHash: data.passwordHash as string,
          firstName: data.firstName as string,
          lastName: data.lastName as string,
          role: (data.role as string) || 'customer',
          isActive: (data.isActive as boolean) ?? true,
          emailVerified: (data.emailVerified as boolean) ?? false,
          createdAt: new Date(),
        };
        users.push(newUser);
        return Promise.resolve(newUser);
      }),
    },
  };

  beforeEach(async () => {
    users.length = 0;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true,
      };

      const httpServer = app.getHttpServer() as string;
      const response = await request(httpServer)
        .post('/api/v1/auth/register')
        .set('X-Tenant-ID', mockTenantId)
        .send(registerDto)
        .expect(201);

      const body = response.body as ApiResponse;
      expect(body.user).toBeDefined();
      expect(body.user?.email).toBe(registerDto.email);
      expect(body.tokens).toBeDefined();
    });

    it('should fail if email already exists in the same tenant', async () => {
      const registerDto = {
        email: 'duplicate@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
        acceptTerms: true,
      };

      const httpServer = app.getHttpServer() as string;
      await request(httpServer)
        .post('/api/v1/auth/register')
        .set('X-Tenant-ID', mockTenantId)
        .send(registerDto);

      await request(httpServer)
        .post('/api/v1/auth/register')
        .set('X-Tenant-ID', mockTenantId)
        .send(registerDto)
        .expect(409);
    });

    it('should fail if terms are not accepted', async () => {
      const registerDto = {
        email: 'no-terms@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: false,
      };

      const httpServer = app.getHttpServer() as string;
      const response = await request(httpServer)
        .post('/api/v1/auth/register')
        .set('X-Tenant-ID', mockTenantId)
        .send(registerDto)
        .expect(400);

      const body = response.body as ApiResponse;
      expect(body.error?.code).toBe('TERMS_NOT_ACCEPTED');
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully with valid credentials', async () => {
      const registerDto = {
        email: 'login@example.com',
        password: 'Password123!',
        firstName: 'User',
        lastName: 'Login',
        acceptTerms: true,
      };

      const httpServer = app.getHttpServer() as string;
      await request(httpServer)
        .post('/api/v1/auth/register')
        .set('X-Tenant-ID', mockTenantId)
        .send(registerDto);

      const response = await request(httpServer)
        .post('/api/v1/auth/login')
        .set('X-Tenant-ID', mockTenantId)
        .send({
          email: registerDto.email,
          password: registerDto.password,
        })
        .expect(200);

      const body = response.body as ApiResponse;
      expect(body.tokens?.accessToken).toBeDefined();
    });

    it('should fail with invalid password', async () => {
      const registerDto = {
        email: 'wrong-pass@example.com',
        password: 'Password123!',
        firstName: 'User',
        lastName: 'Pass',
        acceptTerms: true,
      };

      const httpServer = app.getHttpServer() as string;
      await request(httpServer)
        .post('/api/v1/auth/register')
        .set('X-Tenant-ID', mockTenantId)
        .send(registerDto);

      await request(httpServer)
        .post('/api/v1/auth/login')
        .set('X-Tenant-ID', mockTenantId)
        .send({
          email: registerDto.email,
          password: 'WrongPassword',
        })
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

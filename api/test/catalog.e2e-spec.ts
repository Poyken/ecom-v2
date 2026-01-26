import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { GlobalExceptionFilter } from './../src/common/filters/global-exception.filter';

interface MockCategory {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
}

interface MockProduct {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  basePrice: number;
}

interface MockResponse {
  name: string;
  slug: string;
}

describe('Catalog (e2e)', () => {
  let app: INestApplication;
  const mockTenantId = '75d8d9b1-7a2e-4e9b-8e3b-9e4b5f6a7b8c';

  const categories: MockCategory[] = [];
  const products: MockProduct[] = [];

  const mockPrisma = {
    category: {
      findUnique: jest
        .fn()
        .mockImplementation(
          (args: {
            where: { tenantId_slug: { tenantId: string; slug: string } };
          }) => {
            return Promise.resolve(
              categories.find((c) => c.slug === args.where.tenantId_slug.slug),
            );
          },
        ),
      create: jest.fn().mockImplementation((args: { data: any }) => {
        const data = args.data as Record<string, string>;
        const newItem: MockCategory = {
          id: 'cat-id-' + categories.length,
          tenantId: data.tenantId,
          name: data.name,
          slug: data.slug,
        };
        categories.push(newItem);
        return Promise.resolve(newItem);
      }),
      findMany: jest.fn().mockImplementation(() => Promise.resolve(categories)),
    },
    product: {
      findUnique: jest
        .fn()
        .mockImplementation(
          (args: {
            where: { tenantId_slug: { tenantId: string; slug: string } };
          }) => {
            return Promise.resolve(
              products.find((p) => p.slug === args.where.tenantId_slug.slug),
            );
          },
        ),
      create: jest.fn().mockImplementation((args: { data: any }) => {
        const data = args.data as Record<string, any>;
        const newItem: MockProduct = {
          id: 'prod-id-' + products.length,
          tenantId: data.tenantId as string,
          name: data.name as string,
          slug: data.slug as string,
          basePrice: data.basePrice as number,
        };
        products.push(newItem);
        return Promise.resolve(newItem);
      }),
      findMany: jest.fn().mockImplementation(() => Promise.resolve(products)),
    },
    $transaction: jest
      .fn()
      .mockImplementation((cb: (tx: any) => Promise<any>) => cb(mockPrisma)),
  };

  beforeEach(async () => {
    categories.length = 0;
    products.length = 0;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  it('/catalog/categories (POST) should create category', async () => {
    const dto = { name: 'Electronics', slug: 'electronics' };
    const httpServer = app.getHttpServer() as string;
    const response = await request(httpServer)
      .post('/api/v1/catalog/categories')
      .set('X-Tenant-ID', mockTenantId)
      .send(dto)
      .expect(201);

    const body = response.body as MockResponse;
    expect(body.name).toBe(dto.name);
    expect(categories.length).toBe(1);
  });

  it('/catalog/products (POST) should create product with skus', async () => {
    const dto = {
      name: 'Test Product',
      slug: 'test-product',
      basePrice: 100,
      skus: [{ sku: 'SKU-001', price: 100, stock: 10 }],
    };

    const httpServer = app.getHttpServer() as string;
    const response = await request(httpServer)
      .post('/api/v1/catalog/products')
      .set('X-Tenant-ID', mockTenantId)
      .send(dto)
      .expect(201);

    const body = response.body as MockResponse;
    expect(body.name).toBe(dto.name);
    expect(products.length).toBe(1);
  });

  afterAll(async () => {
    await app.close();
  });
});

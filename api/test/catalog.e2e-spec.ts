import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { GlobalExceptionFilter } from './../src/common/filters/global-exception.filter';

interface ApiResponse {
  name: string;
  slug: string;
}

describe('Catalog Matrix (e2e)', () => {
  let app: INestApplication;
  const mockTenantId = '75d8d9b1-7a2e-4e9b-8e3b-9e4b5f6a7b8c';

  const mockPrisma = {
    category: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockImplementation((args: { data: any }) =>
          Promise.resolve({ ...args.data, id: 'cat-1' }),
        ),
    },
    product: {
      findUnique: jest
        .fn()
        .mockImplementation((args: { where: any; include?: any }) => {
          if (args.include) {
            return Promise.resolve({
              id: 'prod-1',
              name: 'iPhone 15 Pro',
              slug: 'iphone-15-pro',
              options: [],
              skus: [],
            });
          }
          return Promise.resolve(null);
        }),
      create: jest.fn().mockResolvedValue({
        id: 'prod-1',
        slug: 'iphone-15-pro',
        options: [
          {
            name: 'Color',
            values: [{ id: 'val-blue', value: 'Blue' }],
          },
        ],
      }),
    },
    sku: {
      create: jest.fn().mockResolvedValue({ id: 'sku-1' }),
    },
    skuValue: {
      create: jest.fn().mockResolvedValue({ id: 'sv-1' }),
    },
    $transaction: jest
      .fn()
      .mockImplementation((cb: (tx: any) => Promise<any>) => cb(mockPrisma)),
  };

  beforeEach(async () => {
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

  it('/catalog/products (POST) should create product with options and matrix SKUs', async () => {
    const dto = {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      basePrice: 999,
      options: [
        {
          name: 'Color',
          values: [{ value: 'Blue', displayName: 'Ocean Blue' }],
        },
      ],
      skus: [
        {
          sku: 'IP15-BLUE',
          price: 999,
          stock: 10,
          optionValues: [{ optionName: 'Color', value: 'Blue' }],
        },
      ],
    };

    const httpServer = app.getHttpServer() as string;
    const response = await request(httpServer)
      .post('/api/v1/catalog/products')
      .set('X-Tenant-ID', mockTenantId)
      .send(dto)
      .expect(201);

    const body = response.body as ApiResponse;
    expect(body.name).toBe('iPhone 15 Pro');
  });

  afterAll(async () => {
    await app.close();
  });
});

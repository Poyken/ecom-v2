import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('B2B2C Full Flow (e2e)', () => {
  let app: INestApplication;
  let tenantId: string;
  let skuId: string;
  let warehouseId: string;
  const adminEmail = `admin_${Date.now()}@example.com`;
  const domain = `shop-${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();
    
    // Debug routes
    const server = app.getHttpServer();
    const router = server._events.request._router;
    const availableRoutes = router.stack
      .map((layer: any) => layer.route ? `${Object.keys(layer.route.methods).join(',').toUpperCase()} ${layer.route.path}` : null)
      .filter((r: any) => r);
    console.log('Available Routes:', availableRoutes);
  });

  it('Step 1: Onboard Tenant', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/tenants/onboard')
      .send({
        storeName: 'B2B2C Shop',
        domain: domain,
        plan: 'starter',
        adminEmail: adminEmail,
        adminPassword: 'Password123!'
      })
      .expect(201);

    tenantId = response.body.tenant.id;
    expect(tenantId).toBeDefined();
  });

  it('Step 2: Setup Catalog and Inventory', async () => {
    // 3a. Create Category
    await request(app.getHttpServer())
      .post('/api/v1/catalog/categories')
      .set('X-Tenant-ID', tenantId)
      .send({ name: 'Gadgets', slug: `gadgets-${Date.now()}` })
      .expect(201);

    const prodRes = await request(app.getHttpServer())
      .post('/api/v1/catalog/products')
      .set('X-Tenant-ID', tenantId)
      .send({
        name: 'Nexus 10',
        slug: `nexus-10-${Date.now()}`,
        basePrice: 500,
        options: [{ name: 'Storage', values: [{ value: '64GB', displayName: '64 GB' }] }],
        skus: [{ sku: `NX10-64-${Date.now()}`, price: 500, stock: 100, optionValues: [{ optionName: 'Storage', value: '64GB' }] }]
      });
      
    if (prodRes.status !== 201) {
      console.log('Product Creation Error:', JSON.stringify(prodRes.body, null, 2));
    }
    
    expect(prodRes.status).toBe(201);

    skuId = prodRes.body.skus[0].id;

    // 3c. Create Warehouse
    const whRes = await request(app.getHttpServer())
      .post('/api/v1/inventory/warehouses')
      .set('X-Tenant-ID', tenantId)
      .send({ name: 'Hanoi Warehouse', code: `WH-HN-${Date.now()}` })
      .expect(201);
    
    warehouseId = whRes.body.id;

    // 3d. Update Stock
    await request(app.getHttpServer())
      .post('/api/v1/inventory/stock')
      .set('X-Tenant-ID', tenantId)
      .send({ skuId, warehouseId, quantity: 50 })
      .expect(201);
  });

  it('Step 3: Execute Checkout and IPN', async () => {
    const orderRes = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('X-Tenant-ID', tenantId)
      .send({
        items: [{ skuId, quantity: 2 }],
        paymentGateway: 'vnpay',
        shippingAddress: { street: '123 Tech Ave', city: 'Sillicon Valley' }
      })
      .expect(201);

    const orderId = orderRes.body.id;

    // Simulate VNPay Success (IPN)
    await request(app.getHttpServer())
      .get('/api/v1/orders/vnpay-ipn')
      .set('X-Tenant-ID', tenantId)
      .query({ vnp_TxnRef: orderId, vnp_ResponseCode: '00' })
      .expect(200);

    // Verify Order Status
    const finalOrder = await request(app.getHttpServer())
      .get(`/api/v1/orders/${orderId}`)
      .set('X-Tenant-ID', tenantId)
      .expect(200);

    expect(finalOrder.body.status).toBe('processing');
  });

  afterAll(async () => {
    await app.close();
  });
});

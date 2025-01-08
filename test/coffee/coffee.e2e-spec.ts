import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';

import { CoffeesModule } from '../../src/coffees/coffees.module';
import { CreateCoffeeDto } from 'src/coffees/dto/create.coffee.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const coffee = {
    name: 'Coffee 1',
    brand: 'Brand 1',
    flavors: ['Flavor 1', 'Flavor 2'],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          synchronize: true,
          autoLoadEntities: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body).toMatchObject({ ...coffee, flavors: expect.any(Array) });
      });
  });

  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .then(({ body }) => {
        expect(body.id).toBeDefined();

        return request(app.getHttpServer())
          .get('/coffees?page=1&size=20')
          .expect(HttpStatus.OK)
          .then((response) => {
            expect(response.body).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: body.id,
                  ...coffee,
                  flavors: expect.any(Array),
                }),
              ]),
            );
          });
      });
  });

  it.todo('Get one (GET /:id)');
  it.todo('Delete One  [DELETE /:id]');
  it.todo('Update One [PATCH /:id]');

  afterAll(async () => {
    await app.close();
  });
});

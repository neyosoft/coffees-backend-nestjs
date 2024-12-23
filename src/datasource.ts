import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  // TypeORM PostgreSQL DB Drivers
  port: 5432,
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  synchronize: false,
  logging: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
});

export default AppDataSource;

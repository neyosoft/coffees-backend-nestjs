import { DataSource, DataSourceOptions } from 'typeorm';

const dbConfig: DataSourceOptions = {
  // TypeORM PostgreSQL DB Drivers
  port: 5432,
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
};

export default new DataSource(dbConfig);

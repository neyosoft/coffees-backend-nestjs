import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoffeeDescription1707680225916 implements MigrationInterface {
  name = 'AddCoffeeDescription1707680225916';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffees" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "coffees" DROP COLUMN "description"`);
  }
}

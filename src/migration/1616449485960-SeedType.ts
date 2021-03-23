import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { Type } from "../entity/Type";

export class SeedType1616449485960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const typeRepository = getRepository(Type);

    let type1 = new Type();
    type1.name = "root";
    type1.description = "root";
    type1.permissions = ["user.list", "user.create", "user.edit", "user.delete"];

    let type2 = new Type();
    type2.name = "admin";
    type2.description = "admin";
    type2.permissions = ["user.list", "user.create", "user.edit"];

    let type3 = new Type();
    type3.name = "geral";
    type3.description = "geral";
    type3.permissions = [];

    await typeRepository.save(type1);
    await typeRepository.save(type2);
    await typeRepository.save(type3);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

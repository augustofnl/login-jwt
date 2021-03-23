import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { Type } from "../entity/Type";
import { User } from "../entity/User";

export class SeedUser1616449491661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const typeRepository = getRepository(Type);
    const type = await typeRepository.findOne({ where: { name: "root" } });

    let user = new User();
    user.type = type;
    user.status = true;
    user.name = "root";
    user.email = "root@teste.com";
    user.password = "root";
    user.hashPassword();
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import { checkRole } from "../roles/checkRole";
import { Type } from "../entity/Type";

class UserController {
  static listAll = async (req: Request, res: Response) => {
    if(!checkRole(res, "user.list")){
      res.status(401).send();
      return;
    }

    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ["id", "type", "status", "name", "email", "createdAt", "updatedAt"],
      relations: ["type"],
    });
    res.send(users);
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    
    if(!checkRole(res, "user.list", id)){
      res.status(401).send();
      return;
    }

    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ["id", "type", "status", "name", "email", "createdAt", "updatedAt"],
        relations: ["type"],
      });
      res.send(user);
    } catch (error) {
      res.status(404).send("User not found");
    }
  };

  static newUser = async (req: Request, res: Response) => {
    let { typeId, status, name, email, password } = req.body;

    if(!checkRole(res, "user.create")){
      res.status(401).send();
      return;
    }

    const typeRepository = getRepository(Type);
    let type: Type;
    try {
      type = await typeRepository.findOneOrFail(typeId);
    } catch (error) {
      res.status(404).send("Type not found");
      return;
    }

    let user = new User();
    user.type = type;
    user.status = status;
    user.name = name;
    user.email = email;
    user.password = password;

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    user.hashPassword();
    const userRepository = getRepository(User);

    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("email already in use");
      return;
    }
    res.status(201).send("User created");
  };

  static editUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { typeId, status, name, email } = req.body;

    if(!checkRole(res, "user.edit", id)){
      res.status(401).send();
      return;
    }

    const typeRepository = getRepository(Type);
    let type: Type;
    try {
      type = await typeRepository.findOneOrFail(typeId);
    } catch (error) {
      res.status(404).send("Type not found");
      return;
    }

    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }

    user.type = type;
    user.status = status;
    user.name = name;
    user.email = email;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("username already in use");
      return;
    }
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;

    if(!checkRole(res, "user.delete")){
      res.status(401).send();
      return;
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
    userRepository.delete(id);
    res.status(204).send();
  };
}

export default UserController;

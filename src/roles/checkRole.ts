import { Response } from "express";

export const checkRole = (res: Response, role: String, id: Number = 0) => {
  const permissions = res.locals.jwtPayload.permissions;
  const userId = res.locals.jwtPayload.userId;

  if (permissions.indexOf(role) > -1) return true;
  
  if (id == userId) return true;

  return false;
};

import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import sendResponse from "../utility/sendResponse";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access!",
        });
      }

      const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload;

      const userData = await pool.query(
        `
        SELECT * FROM users WHERE id=$1
        `,
        [decoded.id],
      );

      if (userData.rows.length === 0) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "User not found. You must login!",
        });
      }

      if (roles.length && !roles.includes(userData.rows[0].role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden! This role have no access",
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;

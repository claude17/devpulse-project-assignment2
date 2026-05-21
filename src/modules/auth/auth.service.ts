import bcrypt from "bcryptjs";
import type { ILogin, ISignup } from "./auth.interface";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUserIntoDB = async (payLoad: ISignup) => {
  const { name, email, password, role } = payLoad;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,COALESCE($4,'contributor')) RETURNING *
    `,
    [name, email, hashPassword, role],
  );

  delete result.rows[0].password;

  return result;
};

const loginUserIntoDB = async (payLoad: ILogin) => {
  const { email, password } = payLoad;

  const userData = await pool.query(
    `
    SELECT * FROM users where email=$1
    `,
    [email],
  );

  //   delete userData.rows[0].password;

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  // Generate Token

  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtpayload, config.secret as string, { expiresIn: "1d" });

  delete user.password;

  return {
    data: {
      token: accessToken,
      user: user,
    },
  };
};

export const authService = {
  signupUserIntoDB,
  loginUserIntoDB,
};

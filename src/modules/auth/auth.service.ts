import bcrypt from "bcryptjs";
import type { ISignup } from "./auth.interface";

const signupUserIntoDB = async (payLoad: ISignup) => {
  const { name, email, password, role } = payLoad;

  const hashPassword = await bcrypt.hash(password, 10);

  
};

export const authService = {
  signupUserIntoDB,
};

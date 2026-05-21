export interface ISignup {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}

export interface ILogin extends Pick<ISignup, "email" | "password"> {}

import httpStatus from "http-status";
import AppError from "../../Errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser, TPasswordChange } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken } from "./auth.utils";

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
  }

  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not match!");
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
    userId: user.id.toString(),
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret_token as string,
    config.jwt_access_expire_time as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_access_refrest_secret_token as string,
    config.jwt_refrest_expires_time as string,
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const changePassword = async (userInfo: JwtPayload, payload: TPasswordChange) => {
  const { oldPassword, newPassword } = payload;

  const user = await User.isUserExistsByEmail(userInfo.userEmail);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
  }

  if (!(await User.isPasswordMatched(oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password does not match!');
  }

  const hashedPassword = await User.hashPassword(newPassword);
  await User.findOneAndUpdate(
    { _id: userInfo.userId, role: userInfo.role },
    { password: hashedPassword, passwordChangedAt: new Date() }
  );

  return null; // Or return a success message if needed
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(token, config.jwt_access_refrest_secret_token as string) as JwtPayload;

  const user = await User.isUserExistsByEmail(decoded.userEmail);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
  }

  if (
    user.passwordChangedAt &&
    await User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, decoded.iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Token is no longer valid!');
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
    userId: user.id.toString(),
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret_token as string,
    config.jwt_access_expire_time as string
  );

  return { accessToken };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
};

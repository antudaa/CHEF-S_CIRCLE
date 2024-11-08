import { NextFunction, Response, Request } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import sendResponse from "../utils/sendResponse";
import AppError from "../Errors/AppError";
import { User } from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";
import { TUserRole } from "../modules/user/user.interface";

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers)
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Token", token);

  // checking if the token is missing
  if (!token) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Authorization token missing",
    });
  }

  try {
    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret_token as string,
    ) as JwtPayload;

    // Attach user id and role to request object
    (req as any).userId = decoded.sub;
    (req as any).role = decoded.role;
    next();
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.FORBIDDEN,
      message: "Invalid token!",
    });
  }
};

// Middleware for authorize Admin
const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const decoded = jwt.verify(
    token as string,
    config.jwt_access_secret_token as string,
  ) as JwtPayload;

  if (decoded?.role !== "admin") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "You have no access to this route",
    });
  } else {
    next();
  }
};

// Middleware for authorize Users
const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const decoded = jwt.verify(
    token as string,
    config.jwt_access_secret_token as string,
  ) as JwtPayload;

  if (decoded?.role !== "user") {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "You have no access to this route",
    });
  } else {
    next();
  }
};

// Function to verify jwt token
const getUserIdFromToken = (req: Request) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const decoded = jwt.verify(
    token as string,
    config.jwt_access_secret_token as string,
  ) as JwtPayload;
  return decoded.userId;
};

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret_token as string,
    ) as JwtPayload;

    const { role, userId, userEmail, iat } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByEmail(userEmail);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    const userStatus = user?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    if (
      user.passwordChangedAt &&
      await User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized!',
      );
    }

    req.user = decoded as JwtPayload & { role: string };
    next();
  });
};

export {
  auth,
  authenticateUser,
  authorizeAdmin,
  authorizeUser,
  getUserIdFromToken,
};

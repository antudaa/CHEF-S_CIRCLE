import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthServices } from "./auth.service";
import config from "../../config";

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, user } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
  
  res.cookie('accessToken', accessToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      refreshToken,
      accessToken,
      user,
    },
  });
});

const changePassword: RequestHandler = catchAsync(async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const decoded = jwt.verify(
    token as string,
    config.jwt_access_secret_token as string,
  ) as JwtPayload;

  const result = await AuthServices.changePassword(decoded, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully",
    data: result,
  });
});

const logoutUser: RequestHandler = catchAsync(async (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    secure: config.node_env === 'production',
    expires: new Date(0),
    sameSite: 'strict',
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: config.node_env === 'production',
    expires: new Date(0),
    sameSite: 'strict',
  });

  // Optionally send a response back indicating logout success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully",
    // data: result,
  });
});


const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
})

export const AuthControllers = {
  loginUser,
  changePassword,
  logoutUser,
  refreshToken,
};

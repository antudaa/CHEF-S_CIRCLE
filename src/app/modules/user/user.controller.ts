import { RequestHandler } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// Create Admin Controller
const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { body } = req;
  const result = await UserService.createAdminIntoDB(body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});

// Create User Controller
const createUser: RequestHandler = catchAsync(async (req, res) => {
  const { body } = req;
  console.log(req.body);

  const result = await UserService.createUserIntoDB(body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

// Get All Users Controller
const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users data retrieved successfully.",
    data: result,
  });
});

// Get User by ID Controller
const getUserById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getUserByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User data retrieved successfully.",
    data: result,
  });
});

// Block User by SuperAdmin Controller
const blockUserBySuperAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.blockUserBySuperAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User has been blocked successfully.",
    data: result,
  });
});

// Delete User by ID Controller
const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.deleteUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully.",
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  createUser,
  getAllUsers,
  getUserById,
  blockUserBySuperAdmin,
  deleteUser,
};
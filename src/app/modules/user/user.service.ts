import mongoose, { Types } from "mongoose";
import config from "../../config";
import { TAdmin } from "../Admin/admin.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../Errors/AppError";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { Admin } from "../Admin/admin.model";

// Create Admin Service
const createAdminIntoDB = async (payload: TAdmin) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Prepare the user data
    const userData: Partial<TUser> = {
      ...payload,
      role: 'admin',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordChangedAt: new Date(),
    };

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User!');
    }

    // Assign the new user's ID to the 'user' field of the Admin payload
    payload.user = new Types.ObjectId(newUser[0]?._id);

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin!');
    }

    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// Create User Service
const createUserIntoDB = async (payload: TUser) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Prepare the user data
    const userData: Partial<TUser> = {
      ...payload,
      role: 'user',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordChangedAt: new Date(),
    };

    // Create the user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User!');
    }

    await session.commitTransaction();
    return newUser[0]; // Return the created user
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, err.message || 'Failed to create user');
  } finally {
    session.endSession();
  }
};

// Get All User Service
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  try {
    const userQuery = new QueryBuilder(User.find(), query)
      .sort()
      .paginate()
      .fields();

    const users = await userQuery.modelQuery.exec();
    const totalCount = await userQuery.getTotalCount();

    return {
      users, totalCount
    };
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch users');
  }
};

// Get Single User By ID Service
const getUserByIdFromDB = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch user');
  }
};

const updateUserProfile = async (id: string, payload: Partial<TUser>) => {
  try {
    const result = await User.findByIdAndUpdate(
      id,
      payload,
      { new: true }
    )

    if (!result) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Unable to update!")
    }

    return result;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update profile!");
  }
}

// Block User Service
const blockUserBySuperAdmin = async (id: string) => {
  try {
    const result = await User.findByIdAndUpdate(
      id,
      { status: 'blocked' },
      { new: true },
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return result;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to block user');
  }
};

const unBlockUserBySuperAdmin = async (id: string) => {
  try {
    const result = await User.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true },
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return result;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to unblock user');
  }
};

// Soft Delete User Service
const deleteUserFromDB = async (id: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete user');
  }
};

export const UserService = {
  createAdminIntoDB,
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserProfile,
  blockUserBySuperAdmin,
  unBlockUserBySuperAdmin,
  deleteUserFromDB,
};

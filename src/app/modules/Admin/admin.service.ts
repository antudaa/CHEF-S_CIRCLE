import mongoose, { Types } from "mongoose";
import { Admin } from "./admin.model";
import AppError from "../../Errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TAdmin } from "./admin.interface";

const getAllAdminFromDB = async () => {
  const result = await Admin.find().populate('user');
  return result;
};

const getAdminByID = async (id: string) => {
  const result = await Admin.findById(id).populate('user');
  return result;
};

const blockAdminByID = async (id: string) => {

  const session = await mongoose.startSession();

  try {
    session.startTransaction()

    const admin = await Admin.findById(id).populate('user').session(session);

    if (!admin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Admin not exists')
    }

    if (await User.isUserBlocked(admin?.user?._id)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Admin  is already blocked!');
    }

    const result = await User.blockUserByID(admin.user._id);

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to block user!');
    }

    await session.commitTransaction();
    await session.endSession();
  }
  catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const deleteAdminByID = async (id: string) => {

  const session = await mongoose.startSession();

  try {
    session.startTransaction()

    const admin = await Admin.findById(id).populate('user').session(session);

    if (!admin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Admin not exists')
    }

    if (await User.isUserDeleted(admin?.user?._id)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Admin is already deleted!');
    }

    const result = await User.deleteUserByID(admin.user._id);

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user!');
    }

    await session.commitTransaction();
    await session.endSession();
  }
  catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateAdminInfo = async (id: string, payload: Partial<TAdmin>) => {

  if (await User.isUserExistsByID(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not exists!');
  }

  const { ...remainingData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData
  };

  const result = await Admin.findByIdAndUpdate(
    id,
    modifiedUpdatedData,
    { new: true, runValidators: true }
  );

  return result;
};

export const AdminServices = {
  getAllAdminFromDB,
  getAdminByID,
  blockAdminByID,
  deleteAdminByID,
  updateAdminInfo,
};
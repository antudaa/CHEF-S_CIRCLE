import { RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AdminServices } from "./admin.service";

const getAllAdmin: RequestHandler = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllAdminFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data retrieved successfully.",
        data: result,
    });
});

const getAdminByID: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.getAdminByID(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data retrieved successfully.",
        data: result,
    });
});

const blockAdminByID: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.blockAdminByID(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin has been blocked successfully.",
        data: result,
    });
});

const deleteAdminByID: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.deleteAdminByID(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin has been blocked successfully.",
        data: result,
    });
});

const updateAdminByID: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.updateAdminInfo(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data updated successfully.",
        data: result,
    });
});

export const AdminControllers = {
    getAllAdmin,
    getAdminByID,
    blockAdminByID,
    deleteAdminByID,
    updateAdminByID,
};
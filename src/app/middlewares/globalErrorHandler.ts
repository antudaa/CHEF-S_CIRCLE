import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import config from "../config";
import handleZodError from "../Errors/handleZodError";
import { TErrorSources } from "../Interface/error.interface";
import handleMongooseValidationError from "../Errors/handleMongooseValidationError";
import handleMongooseCastError from "../Errors/handleMongooseCastError";
import handleDuplicateError from "../Errors/handleDuplicateError";
import AppError from "../Errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError?.statusCode ?? statusCode;
    message = simplifiedError?.message ?? message;
    errorSources = simplifiedError?.errorSources ?? errorSources;
  } else if (error?.name === "ValidationError") {
    const simplifiedError = handleMongooseValidationError(error);
    statusCode = simplifiedError?.statusCode ?? statusCode;
    message = simplifiedError?.message ?? message;
    errorSources = simplifiedError?.errorSources ?? errorSources;
  } else if (error?.name === "CastError") {
    const simplifiedError = handleMongooseCastError(error);
    statusCode = simplifiedError?.statusCode ?? statusCode;
    message = simplifiedError?.message ?? message;
    errorSources = simplifiedError?.errorSources ?? errorSources;
  } else if (error?.code === 11000 || (error?.message && error.message.includes("duplicate key error"))) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError?.statusCode ?? statusCode;
    message = simplifiedError?.message ?? message;
    errorSources = simplifiedError?.errorSources ?? errorSources;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode ?? statusCode;
    message = error.message;
    errorSources = [
      {
        path: "",
        message: error?.message ?? message,
      },
    ];
  } else if (error instanceof Error) {
    message = error.message;
    errorSources = [
      {
        path: "",
        message: error?.message ?? message,
      },
    ];
  }

  // Ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === "development" ? error?.stack : null,
  });
};

export default globalErrorHandler;

import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { BOARD_TYPE } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

//Validate dữ liệu từ FE đẩy lên
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "Title is required",
      "string.empty": "Title is not allowed to be empty",
      "string.min": "Title length must be at least 3 characters long",
      "string.max":
        "Title length must be less than or equal to 5 characters long",
      "string.trim": "Title must not have leading or trailing whitespace",
    }),
    description: Joi.string()
      .required()
      .min(3)
      .max(255)
      .trim()
      .strict()
      .messages({
        "any.required": "Description is required",
        "string.empty": "Description is not allowed to be empty",
        "string.min": "Description length must be at least 3 characters long",
        "string.max":
          "Description length must be less than or equal to 5 characters long",
        "string.trim":
          "Description must not have leading or trailing whitespace",
      }),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required(),
  });

  try {
    //abortEarly: false => trường hợp có nhiều lỗi validation thì trả về tất cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    //Validate dữ liệu xong thì cho request đi tiếp sang Controller
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    );
    next(customError);
  }
};

const update = async (req, res, next) => {
  //Không dùng require trong trường hợp update
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
  });

  try {
    //abortEarly: false => trường hợp có nhiều lỗi validation thì trả về tất cả lỗi
    //Đối với trường hợp update, cho phép Unknown để không cần đẩy 1 số field lên
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    );
    next(customError);
  }
};

const moveCardToDifferentColumns = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),

    prevColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),

    nextColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
  });

  try {
    //abortEarly: false => trường hợp có nhiều lỗi validation thì trả về tất cả lỗi
    //Đối với trường hợp update, cho phép Unknown để không cần đẩy 1 số field lên
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
    });

    next();
  } catch (error) {
    //next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    const errorMessage = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    );
    next(customError);
  }
};

export const boardValidation = {
  createNew,
  update,
  moveCardToDifferentColumns,
};

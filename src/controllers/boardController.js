import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  try {
    // console.log(req.body);
    // console.log(req.query);
    // console.log(req.params);
    // console.log(req.files);
    // console.log(req.cookies);
    // console.log(req.jwtDecoded);
    //Điều hướng DL sang tầng Service
    // throw new ApiError(StatusCodes.BAD_GATEWAY, "test error");
    //Có kết quả trả về Client
    res.status(StatusCodes.CREATED).json({
      message: "POST from Controller: API create new boards",
    });
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
};

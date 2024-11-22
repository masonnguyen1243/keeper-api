import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
  try {
    // console.log(req.body);
    // console.log(req.query);
    // console.log(req.params);
    // console.log(req.files);
    // console.log(req.cookies);
    // console.log(req.jwtDecoded);

    //Điều hướng DL sang tầng Service
    const createdBoard = await boardService.createNew(req.body);

    //Có kết quả => trả về Client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
};

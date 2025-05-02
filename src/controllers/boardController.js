import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";

//Điều hướng các loại dữ liệu phía BE
const createNew = async (req, res, next) => {
  try {
    //Điều hướng DL sang tầng Service
    const createdBoard = await boardService.createNew(req.body);

    //Có kết quả => trả về Client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const board = await boardService.getDetails(boardId);

    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const updatedBoard = await boardService.update(boardId, req.body);

    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};

const moveCardToDifferentColumns = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumns(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumns,
};

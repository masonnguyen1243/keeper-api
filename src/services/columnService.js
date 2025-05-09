/* eslint-disable no-useless-catch */
import { columnModel } from "~/models/columnModel";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody,
    };

    const createdColumn = await columnModel.createNew(newColumn);
    const getNewColumn = await columnModel.findOneById(
      createdColumn.insertedId
    );

    if (getNewColumn) {
      //Xử lý cấu trúc data trước khi trả dữ liệu về
      getNewColumn.cards = [];

      //Cập nhật lại mảng columnOrderIds
      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedColumn = await columnModel.update(columnId, updateData);

    return updatedColumn;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId);

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Column not found");
    }

    //Xoa Column
    await columnModel.deleteOneById(columnId);

    //Xoa Cards
    await cardModel.deleteManyByColumnId(columnId);

    //Xoa ColumnIds
    await boardModel.pullColumnOrderIds(targetColumn);

    return { deleteResult: "Column and its Cards deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
  update,
  deleteItem,
};

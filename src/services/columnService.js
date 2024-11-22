/* eslint-disable no-useless-catch */
import { columnModel } from "~/models/columnModel";
import { boardModel } from "~/models/boardModel";

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

export const columnService = {
  createNew,
};

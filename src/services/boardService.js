/* eslint-disable no-useless-catch */
import { slugify } from "~/utils/formatters";

const createNew = async (reqBody) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database

    //Làm thêm các xử lý logic khác với Collection khác tùy từng dự án
    //Bắn email, notification về cho admin khi có 1 cái board mới được tạo

    //Trả kết quả về, trong Service luôn phải có return
    return newBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
};

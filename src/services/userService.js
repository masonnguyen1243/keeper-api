import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatters";

const createNew = async (reqBody) => {
  try {
    //Kiểm tra xem Email đã tồn tại hay chưa
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists!");
    }

    //Tạo data để lưu vào database
    const nameFromEmail = reqBody.email.split("@")[0];
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), //hashedPassword
      username: nameFromEmail,
      displayName: nameFromEmail, //Mặc định để giống username khi đăng ký mới, về sau làm tính năng update cho user
      verifyToken: uuidv4(),
    };

    //Thực hiện lưu thông tin user vào database
    const createdUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(createdUser.insertedId);

    //Gửi email cho ng dùng xác thực tài khoản

    //return trả về dữ liệu phía controller
    return pickUser(getNewUser);
  } catch (error) {
    console.log(error);
  }
};

export const userService = {
  createNew,
};

import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatters";
import { WEBSITE_DOMAIN } from "~/utils/constants";
import { BrevoProvider } from "~/providers/BrevoProvider";
import { env } from "~/config/environment";
import { JwtProvider } from "~/providers/JwtProvider";

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
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`;
    const costomSubject = "Please verify your email before using our service";
    const htmlContent = `
      <h3>Here is your verification link</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely, <br/> - Mason Nguyen - </h3>
    `;

    //Gọi tới Provider gửi mail
    await BrevoProvider.sendEmail(getNewUser.email, costomSubject, htmlContent);

    //return trả về dữ liệu phía controller
    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};

const verifyAccount = async (reqBody) => {
  try {
    //Kiểm tra User trong DB
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    }
    if (existUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is already active!"
      );
    }
    if (reqBody.token !== existUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Invalid token!");
    }

    //Nếu như mọi thứ OK -> bắt đầu update lại thông tin của user để verify tài khoản
    const updateData = {
      isActive: true,
      verifyToken: null,
    };

    //Thực hiện update thông tin user
    const updatedUser = await userModel.update(existUser._id, updateData);

    //Trả về kết quả cho controller
    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody) => {
  try {
    //Kiểm tra User trong DB
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    }
    if (!existUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active! Please check your email!"
      );
    }
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your email and/or password is incorrect!"
      );
    }

    /** Nếu mọi thứ OK thì bắt đầu tạo token đăng nhập để trả về phía FE */
    //Tạo thông tin để đính kèm trong JWT token bao gồm _id và email của user
    const userInfo = { _id: existUser._id, email: existUser.email };

    //Tạo ra 2 loại token: accessToken và refreshToken để trả về cho phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    );

    //Trả về thông tin của user kèm theo 2 cái token vừa tạo
    return {
      accessToken,
      refreshToken,
      ...pickUser(existUser),
    };
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  verifyAccount,
  login,
};

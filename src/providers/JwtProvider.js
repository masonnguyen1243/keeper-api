import JWT from "jsonwebtoken";

/**
 * Func tạo mới một token gồm 3 tham số đầu vào
 * userInfo: Những thông tin muốn đính kèm token
 * serectSignature: Chữ ký bí mật (dạng 1 chuỗi string ngẫu nhiên)
 * tokenLife: Thời gian tồn tại của token
 */
const generateToken = async (userInfo, serectSignature, tokenLife) => {
  try {
    //mặc định jwt.sign() là HS256
    return JWT.sign(userInfo, serectSignature, {
      algorithm: "HS256",
      expiresIn: tokenLife,
    });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Func kiểm tra 1 token có hợp lệ hay không
 * Hợp lệ ở đây được hiểu là cái token được tạo ra có đúng với cái chữ ký bí mật secretSignature hay không
 */
const verifyToken = async (token, serectSignature) => {
  try {
    //Hàm verify của thư viện jwt
    return JWT.verify(token, serectSignature);
  } catch (error) {
    throw new Error(error);
  }
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};

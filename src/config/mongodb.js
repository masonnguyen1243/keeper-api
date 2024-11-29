import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config/environment";

//Khởi tạo 1 đối tượng keeperDatabaseInstance ban đầu là null (vì chưa connect)
let keeperDatabaseInstance = null;

//Khởi tại một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  //Chỉ định 1 cái Stable API Version của MongoDB
  //https://www.mongodb.com/docs/drivers/node/current/fundamentals/stable-api/
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//Kết nối tới Database
export const CONNECT_DB = async () => {
  //Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect();

  //Kết nối thành công thì lấy ra Database theo tên và gán ngược lại vào biến keeperDatabaseInstance
  keeperDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

//Đóng kết nối tới Database khi cần
export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};

//Functuon GET_DB (không async) có nhiệm vụ export ra cái keeperDatabaseInstance sau khi đã connect thành công
//tới MongoDB để sử dụng ở nhiều nơi khác nhau trong code
//Chỉ gọi cái GET_DB này khi đã kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!keeperDatabaseInstance)
    throw new Error("Must connect to Database first");
  return keeperDatabaseInstance;
};

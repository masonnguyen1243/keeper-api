import express from "express";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";

const START_SERVER = () => {
  const app = express();

  //Bật req.body json data
  app.use(express.json());

  //Sử dụng APIs_V1
  app.use("/v1", APIs_V1);

  //Middlewares xử lý lỗi tập trung
  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `Hi ${env.AUTHOR}, Back-end Server is running successfully at http://${env.APP_HOST}:${env.APP_PORT}/`
    );
  });

  //Thực hiện các thao tác cleanup trước khi dừng server lại
  exitHook(() => {
    console.log("Server is shuting down...");
    CLOSE_DB();
    console.log("Disconnected from MongoDB Cloud Atlas");
  });
};

//Chỉ khi kết nối tới Database thành công thì mới Start Server Back-end lên
//Immediately Invoked Function Expression (IIFE)
(async () => {
  try {
    console.log("Connecting to MongoDB Cloud Atlas...");
    await CONNECT_DB();
    console.log("Connected to MongoDB Cloud Atlas");

    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();

//Cách viết khác
//Chỉ khi kết nối tới Database thành công thì mới Start Server Back-end lên
// CONNECT_DB()
//   .then(() => console.log("Connected to MongoDB Cloud Atlas"))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error);
//     process.exit(0);
//   });

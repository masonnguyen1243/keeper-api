import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRoute } from "~/routes/v1/boardRoute";

const Router = express.Router();

//Check APIs_V1 status
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "API V1 are ready to use",
  });
});

//Boards API
Router.use("/boards", boardRoute);

export const APIs_V1 = Router;

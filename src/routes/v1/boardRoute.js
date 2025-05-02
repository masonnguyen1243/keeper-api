import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardValidation } from "~/validations/boardValidation";
import { boardController } from "~/controllers/boardController";

//API endpoint
const Router = express.Router();

Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message: "GET: API get list boards",
    });
  })
  .post(boardValidation.createNew, boardController.createNew);

Router.route("/:id")
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update);

//API hỗ trợ cho việc di chuyển Card giữa những Column khác nhau
Router.route("/supports/moving_card").put(
  boardValidation.moveCardToDifferentColumns,
  boardController.moveCardToDifferentColumns
);

export const boardRoute = Router;

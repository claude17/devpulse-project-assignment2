import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter_id = req.user?.id;
    const result = await issuesService.createIssueIntoDB(req.body, reporter_id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const sort = req.query.sort === "oldest" ? "oldest" : "newest";

    const type =
      req.query.type === "bug" || req.query.type === "feature_request" ? req.query.type : undefined;

    const status =
      req.query.status === "open" ||
      req.query.status === "in_progress" ||
      req.query.status === "resolved"
        ? req.query.status
        : undefined;

    const result = await issuesService.getAllIssuesFromDB(sort, type, status);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
};

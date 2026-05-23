import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";
import { IssueSort, USER_ROLE, IssueType, IssueStatus, type SORT } from "../../types";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter_id = req.user?.id;
    const result = await issuesService.createIssueIntoDB(req.body, reporter_id as string);

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const sort = req.query.sort === IssueSort.oldest ? IssueSort.oldest : IssueSort.newest;

    const type =
      req.query.type === IssueType.bug || req.query.type === IssueType.feature_request
        ? req.query.type
        : undefined;

    const status =
      req.query.status === IssueStatus.open ||
      req.query.status === IssueStatus.in_progress ||
      req.query.status === IssueStatus.resolved
        ? req.query.status
        : undefined;

    const result = await issuesService.getAllIssuesFromDB(sort, type, status);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await issuesService.getSingleIssueFromDB(id as string);

    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
        data: {},
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const existingIssue = await issuesService.getSingleIssueFromDB(id as string);

    if (!existingIssue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    const isContributor = user?.role === USER_ROLE.contributor;
    const isMaintainer = user?.role === USER_ROLE.maintainer;

    if (isContributor) {
      if (existingIssue.reporter.id !== user.id) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden! You can only update your own issue",
        });
      }

      if (existingIssue.status !== "open") {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden! This issue is not open",
        });
      }

      if ("status" in req.body) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden! Contributors cannot update status",
        });
      }
    }

    const payload = isMaintainer
      ? req.body
      : {
          title: req.body.title,
          description: req.body.description,
          type: req.body.type,
        };

    const result = await issuesService.updateSingleIssueFromDB(id as string, payload);

    if (result.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await issuesService.deleteSingleIssueFromDB(id as string);

    if (result.rowCount === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateSingleIssue,
  deleteSingleIssue,
};

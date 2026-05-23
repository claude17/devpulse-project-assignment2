import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();

router.post("/", auth(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.createIssue);

router.get("/", issuesController.getAllIssues);

router.get("/:id", issuesController.getSingleIssue);

router.patch(
  "/:id",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.updateSingleIssue,
);

router.delete("/:id", auth(USER_ROLE.maintainer), issuesController.deleteSingleIssue);

export const issuesRoute = router;

export const USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

export type ROLES = "contributor" | "maintainer";

export const IssueSort = {
  oldest: "oldest",
  newest: "newest",
} as const;

export type SORT = "newest" | "oldest";

export const IssueType = {
  bug: "bug",
  feature_request: "feature_request",
} as const;

export type TYPE = "bug" | "feature_request";

export const IssueStatus = {
  open: "open",
  in_progress: "in_progress",
  resolved: "resolved",
} as const;

export type STATUS = "open" | "in_progress" | "resolved";

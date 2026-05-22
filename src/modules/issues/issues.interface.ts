export interface IIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
  reporter_id?: number;
}

export interface IGetAllIssuesQuery {
  sort?: "newest" | "oldest";
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}

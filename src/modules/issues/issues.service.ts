import type { Request } from "express";
import { pool } from "../../db";
import type { IGetAllIssuesQuery, IIssue } from "./issues.interface";

const createIssueIntoDB = async (payLoad: IIssue, id: number) => {
  const reporter_id = id;
  const { title, description, type } = payLoad;

  const result = await pool.query(
    `
    INSERT INTO issues (title, description,type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *
    `,
    [title, description, type, reporter_id],
  );

  return result;
};

const getAllIssuesFromDB = async (
  sort: "newest" | "oldest",
  type?: "bug" | "feature_request",
  status?: "open" | "in_progress" | "resolved",
) => {
  const result = await pool.query(`
    SELECT *
    FROM issues
    ${type ? `WHERE type = '${type}'` : ""}
    ${status ? `${type ? "AND" : "WHERE"} status = '${status}'` : ""}
    ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}   
    `);

  const issues = result.rows;

  //     if (issues.length === 0) {
  //     return [];
  //   }
  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const usersResult = await pool.query(
    `
  SELECT id, name, role
  FROM users
  WHERE id = ANY($1)
  `,
    [reporterIds],
  );

  const users = usersResult.rows;

  const data = issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: users.find((user) => user.id === issue.reporter_id) || null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return data;
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
};

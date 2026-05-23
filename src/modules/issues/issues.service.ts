import type { Request } from "express";
import { pool } from "../../db";
import type { IIssue, IUpdateIssue } from "./issues.interface";
import { IssueSort, type SORT, type STATUS, type TYPE } from "../../types";

const createIssueIntoDB = async (payLoad: IIssue, id: string) => {
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

const getAllIssuesFromDB = async (sort: SORT, type?: TYPE, status?: STATUS) => {
  const result = await pool.query(`
    SELECT *
    FROM issues
    ${type ? `WHERE type = '${type}'` : ""}
    ${status ? `${type ? "AND" : "WHERE"} status = '${status}'` : ""}
    ORDER BY created_at ${sort === IssueSort.oldest ? "ASC" : "DESC"}   
    `);

  const issues = result.rows;

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

const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
        SELECT * FROM issues WHERE id =$1    
        `,
    [id],
  );

  const issue = result.rows[0];

  if (!issue) {
    return null;
  }

  const userResult = await pool.query(
    `
  SELECT id, name, role
  FROM users
  WHERE id =$1
  `,
    [result.rows[0].reporter_id],
  );

  const data = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: userResult.rows[0],
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };

  return data;
};

const updateSingleIssueFromDB = async (id: string, payLoad: IUpdateIssue) => {
  const { title, description, type, status } = payLoad;
  const result = await pool.query(
    `
      UPDATE issues 
      SET 
      title=COALESCE($1,title),
      description=COALESCE($2,description),
      type=COALESCE($3,type),
      status=COALESCE($4,status),
      updated_at=NOW()
      WHERE id=$5 RETURNING *
      `,
    [title, description, type, status, id],
  );
  return result;
};

const deleteSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM issues WHERE id=$1
      `,
    [id],
  );
  return result;
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateSingleIssueFromDB,
  deleteSingleIssueFromDB,
};

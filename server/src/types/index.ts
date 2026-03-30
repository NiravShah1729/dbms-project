/**
 * Programming Practice Progress Management System
 * Core TypeScript Types & Interfaces
 */

export enum RoleName {
  ADMIN = 'admin',
  USER = 'user',
}

export enum VerdictName {
  AC = 'AC',
  WA = 'WA',
  TLE = 'TLE',
  MLE = 'MLE',
  CE = 'CE',
}

export interface User {
  UserID: number;
  FullName: string;
  Email: string;
  PasswordHash?: string; // Optional for security
  CF_Handle?: string;
  IsVerified: boolean;
  Roles: RoleName[];
}

export interface Question {
  QuestionID: number;
  AdminID: number;
  CF_Link: string;
  Title?: string;
  Rating?: number;
  Tags?: string;
  Hint?: string;
  IsVerified: boolean;
  CreatedAt: Date;
}

export interface ReferenceSolution {
  RefSolID: number;
  QuestionID: number;
  Description?: string;
  CodeSnippet: string;
  Language: string;
}

export interface Submission {
  SubmissionID: number;
  UserID: number;
  QuestionID: number;
  VerdictID: number;
  VerdictName: VerdictName;
  SubmittedCode: string;
  SubmittedAt: Date;
}

export interface PersonalNote {
  NoteID: number;
  UserID: number;
  QuestionID: number;
  Content: string;
  UpdatedAt: Date;
}

export interface UserStats {
  StatID: number;
  UserID: number;
  TotalSolved: number;
  CurrentRank?: number;
  UpdatedAt: Date;
}

export interface Discussion {
  DiscussionID: number;
  QuestionID: number;
  UserID: number;
  FullName: string; // From join
  Text: string;
  CreatedAt: Date;
  Upvotes: number;
  Downvotes: number;
  UserVote?: number; // 1, -1 or null
}

export interface CFVerificationToken {
  TokenID: number;
  UserID: number;
  Token: string;
  CreatedAt: Date;
}

export interface Bookmark {
  BookmarkID: number;
  UserID: number;
  QuestionID: number;
  CreatedAt: Date;
}

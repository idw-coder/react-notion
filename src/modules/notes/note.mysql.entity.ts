// import { Database } from "database.types";

/**
 * Noteの型定義
 * @type {Note} Noteの型
 * @description Noteの型定義
 * @example
 * const note: Note = {
 *   id: 1,
 *   title: 'ノート1',
 *   content: 'ノート1の内容',
 */

export type Note = {
  id: number;
  title: string;
  content: string;
  parent_document: number | null;
  user_id: string;
  created_at: string;
}
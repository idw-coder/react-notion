// Profile エンティティの型定義。
// Supabase のスキーマ型（database.types.ts）から、profiles テーブルの Row を参照します。
// - Profile は 1 レコード（行）を表します
// - 挿入/更新には Database["public"]["Tables"]["profiles"]["Insert" | "Update"] を利用してください
import { Database } from "database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
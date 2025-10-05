import {
  createClient,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import {Database} from "../../database.types";
import {UserRoundIcon} from "lucide-react";
import {Note} from "../modules/notes/note.entity";

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
);

// TODO: 理解
export const subscribe = (
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<Note>) => void
) => {
  /**
   * ノートの変更をリアルタイムで監視するチャンネルを設定
   * @param userId 監視対象のユーザーID
   * @param callback 変更が検知された際に実行されるコールバック関数
   * @returns Supabaseのリアルタイムチャンネル購読オブジェクト
   */
  return supabase
    .channel("note-changes") // チャンネル名を指定（複数のチャンネルを区別するため）
    .on<Note>(
      "postgres_changes", // PostgreSQLの変更イベントを監視
      {
        event: "*", // 監視するイベント（INSERT, UPDATE, DELETEすべて）
        schema: "public", // データベーススキーマ名
        table: "notes", // 監視対象のテーブル名
        filter: `user_id=eq.${userId}`, // 特定ユーザーのノートのみを監視
      },
      callback // 変更が検知された際に実行される関数
    )
    .subscribe(); // チャンネルを購読開始
};

export const unsubscribe = (channel: RealtimeChannel) => {
  supabase.removeChannel(channel);
};

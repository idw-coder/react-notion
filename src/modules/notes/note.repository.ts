import {supabase} from "@/lib/supabase";
import {de} from "@blocknote/core/locales";

/*
 * Supabaseクライアントを使用してDB操作
 * noteRepositoryの各メソッドからSupabaseのREST APIへ非同期でリクエストを送信
 */

export const noteRepository = {
  async create(userId: string, params: {title?: string; parentId?: number}) {
    const {data, error} = await supabase
      .from("notes")
      .insert({
        user_id: userId,
        title: params.title,
        parent_document: params.parentId,
      }) // レコードを挿入
      .select() // レコードを選択（インサートしたノートのオブジェクトが一つだけある配列ごと返される）
      .single(); // 配列からオブジェクトに変換して返す
    if (error != null) throw new Error(error.message);
    return data;
  },
  async find(userId: string, parentDocumentId?: number) {
    const query = supabase
      .from("notes")
      .select()
      .eq("user_id", userId)
      .order("created_at", {ascending: false});

    const {data} =
      parentDocumentId != null
        ? await query.eq("parent_document", parentDocumentId)
        : await query.is("parent_document", null);
    return data;
  },

  async findByKeyword(userId: string, keyword: string) {
    const {data} = await supabase
      .from("notes")
      .select()
      .eq("user_id", userId)
      // like検索は大文字小文字を区別しない、%は任意の文字列を表す
      .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`)
      .order("created_at", {ascending: false});
    return data;
  },

  async findOne(userId: string, id: number) {
    const {data} = await supabase
      .from("notes")
      .select()
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    return data;
  },
  // Noteの更新
  async update(id: string, note: {title?: string; content?: string}) {
    const {data} = await supabase
      .from("notes")
      .update(note)
      .eq("id", id) // where
      .select()
      .single();
    return data;
  },
  // Noteの削除
  async delete(id: number) {
    const {error} = await supabase.rpc("delete_children_notes_recursively", {
      note_id: id,
    });
    if (error != null) throw new Error(error.message);
    return;
  },
};

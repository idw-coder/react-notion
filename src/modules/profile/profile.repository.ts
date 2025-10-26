import { supabase } from "@/lib/supabase";

// プロフィール関連のデータアクセスのリポジトリ
export const profileRepository = {
  /**
   * 指定したユーザーのプロフィールを取得します。
   * - レコードが存在しない場合、 null を返します。
   */
  async getProfile(userId: string) {
    console.log("[getProfile] 開始 - userId:", userId);

    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .single();

    console.log("[getProfile] 結果 - data:", data, "error:", error);

    if (error && error.code !== "PGRST116") {
      console.error("[getProfile] エラー:", error.message);
      throw new Error(error.message);
    }

    console.log("[getProfile] 完了 - 返却データ:", data);
    return data;
  },

  /**
   * アバター画像を Supabase Storage（avatars バケット）にアップロードし、公開 URL を返す
   * @param userId ユーザーID
   * @param file アップロードするファイル
   * @returns 公開 URL
   * @throws エラー
   */
  async uploadAvatar(userId: string, file: File) {
    console.log(
      "[uploadAvatar] 開始 - ファイル名 ", file.name
    );

    const baseName = file.name.replace(/\.[^/.]+$/, ""); // 拡張子を除いた名前
    const ext = file.name.split(".").pop(); // 拡張子
    let fileName = file.name; // 初期値: 元のファイル名
    let counter = 1;
    // すでに存在するか確認
    const { data: existing } = await supabase.storage.from("avatars").list("");

    // 存在する場合、末尾に (n) を追加、重複している場合はnを追加
    while (existing && existing.some((f) => f.name === fileName)) {
      fileName = `${baseName}(${counter}).${ext}`;
      counter++;
    }
    console.log("[uploadAvatar] 生成されたファイル名 ", fileName);

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: false });

    if (error) throw new Error(error.message);

    // 公開URLを返す
    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return data.publicUrl;
  },

  /**
   * プロフィールの upsert（挿入 or 更新）を実行し、更新後のレコードを返します。
   */
  async updateProfile(userId: string, avatarUrl: string) {
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: userId, avatar_url: avatarUrl })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};

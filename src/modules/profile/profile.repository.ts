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
   * アバター画像を Supabase Storage（avatars バケット）にアップロードし、公開 URL を返します。
   */
  async uploadAvatar(userId: string, file: File) {
    console.log("[uploadAvatar] 開始 - userId:", userId, "fileName:", file.name, "fileSize:", file.size);
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`; // 
    console.log("[uploadAvatar] 生成されたfileName:", fileName);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        upsert: true, // ファイルが存在する場合は上書き
      });

    console.log("[uploadAvatar] アップロード結果 - error:", uploadError);

    if (uploadError) {
      console.error("[uploadAvatar] アップロードエラー:", uploadError.message);
      throw new Error(uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    console.log("[uploadAvatar] 完了 - publicUrl:", publicUrl);
    return publicUrl;
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
  }
};
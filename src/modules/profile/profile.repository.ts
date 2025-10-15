import { supabase } from "@/lib/supabase";

// プロフィール関連のデータアクセスのリポジトリ
export const profileRepository = {
  /**
   * 指定したユーザーのプロフィールを取得します。
   * - レコードが存在しない場合、 null を返します。
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .single();
    
    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }
    return data;
  },

  /**
   * アバター画像を Supabase Storage（avatars バケット）にアップロードし、公開 URL を返します。
   */
  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`; // 

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        upsert: true, // ファイルが存在する場合は上書き
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

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
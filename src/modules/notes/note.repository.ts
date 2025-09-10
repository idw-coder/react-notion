import { supabase } from "@/lib/supabase";

export const noteRepository = {
    async create(
        userId: string,
        params: { title?: string, parentId?: number }
    ) {
        const { data, error } = await supabase.from("notes").insert({ 
            user_id: userId,
            title: params.title,
            parent_id: params.parentId,
        })         // レコードを挿入
        .select()  // レコードを選択
        .single(); // レコードを返す
        if (error != null) throw new Error(error.message);
        return data;
    },
}
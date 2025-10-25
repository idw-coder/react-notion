import { atom, useAtom } from "jotai";
// import { User } from "@supabase/supabase-js";

/**
 * ログインしているユーザーの情報を管理する
 * ログインしていない場合はnull
 * ログインしている場合はUserオブジェクト、Userオブジェクトのパラメーター下記 ?? 要確認
 * - id: ユーザーID
 * - email: メールアドレス
 * - user_metadata: ユーザーメタデータ
 * - user_metadata.name: ユーザー名
 * - user_metadata.avatar_url: ユーザーのアバターURL
 * - user_metadata.avatar_url_timestamp: ユーザーのアバターURLのタイムスタンプ
 */

type User = {
    id: string;
    email: string;
    name: string;
} | undefined;
const currentUserAtom = atom<User>();

/**
 * hooks
 * @returns {Object} { currentUser: User, set: Function } ユーザー情報と更新関数
 */
export const useCurrentUserStore = () => {
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
    return { currentUser, set: setCurrentUser };
}
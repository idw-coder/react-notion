import { atom, useAtom } from "jotai";
import { User } from "@supabase/supabase-js";

/**
 * ログインしているユーザーの情報を管理する
 * ログインしていない場合はnull
 * ログインしている場合はUserオブジェクト
 */
const currentUserAtom = atom<User>();

/**
 * hooks
 * @returns {Object} { currentUser: User, set: Function } ユーザー情報と更新関数
 */
export const useCurrentUserStore = () => {
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
    return { currentUser, set: setCurrentUser };
}
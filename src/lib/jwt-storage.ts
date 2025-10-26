/**
 * JWTトークンをLocalStorageで管理するユーティリティ
 */

const TOKEN_KEY = 'jwtToken'; // キー名も変更

/**
 * JWTトークンを保存
 */
export const saveToken = (token: string): void => {

    /**
     * localStorageとはブラウザのローカルストレージにデータを保存するためのAPI
     * setItemメソッドでキーと値を保存する
     * @param TOKEN_KEY キー名
     * @param token トークン
     */
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * JWTトークンを取得
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * JWTトークンを削除
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * JWTトークンが存在するかチェック
 */
export const hasToken = (): boolean => {
  return getToken() !== null;
};
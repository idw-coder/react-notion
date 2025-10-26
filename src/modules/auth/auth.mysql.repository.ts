import { saveToken, getToken, removeToken, hasToken } from '@/lib/jwt-storage';

const API_URL = 'http://localhost:3000';

export const authRepository = {
    async signup(name: string, email: string, password: string) {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error ?? 'ユーザー登録に失敗しました。');
        }

        const data = await response.json();

        // JWTトークンを保存
        if (data.token) {
            saveToken(data.token);
        }

        return {
            id: data.id,
            email: data.email,
            name: data.name,
        };
    },

    async signin(email: string, password: string) {
        const response = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error ?? 'ログインに失敗しました。');
        }

        const data = await response.json();

        // JWTトークンを保存
        if (data.token) {
            saveToken(data.token);
        }

        return {
            id: data.id,
            email: data.email,
            name: data.name,
        };
    },

    async getCurrentUser() {
        // ローカルストレージからJWTトークンを取得
        const token = getToken();

        if (!token) { return null; }

        // JWTトークン検証リクエスト
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            // トークンが無効な場合は削除
            removeToken();
            return null;
        }

        const data = await response.json();
        return {
            id: data.id,
            email: data.email,
            name: data.name,
        };
    },


    async signout() {
        // JWTトークンを削除
        removeToken();
        return true;
    }
}
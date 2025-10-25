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
        return {
            id: data.id,
            email: data.email,
            name: data.name,
        };
    },

    async getCurrentUser() {
        // TODO: セッション管理の実装後に対応
        return null;
    },


    async signout() {
        // TODO: セッション管理の実装後に対応
        return true;
    }
}
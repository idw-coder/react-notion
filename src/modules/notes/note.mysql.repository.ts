const API_URL = 'http://localhost:3000';

/*
 * ExpressのAPIサーバーからMySQLデータベースへ非同期でリクエストを送信
 */

export const noteRepository = {

  // Noteの作成
  async create(userId: string, params: {title?: string; parentId?: number}) {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, params }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? 'ノート作成に失敗しました。');
    }
    return await response.json();
  },

  // Noteの取得
  async find(userId: string, parentDocumentId?: number) {
    
    const params = new URLSearchParams({ userId });
    if (parentDocumentId !== undefined) {
      params.append('parentDocumentId', String(parentDocumentId));
    }
    const response = await fetch(`${API_URL}/notes?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? 'ノート取得に失敗しました。');
    }
    return await response.json();
  },

  // Noteの検索
  async findByKeyword(userId: string, keyword: string) {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? 'ノート検索に失敗しました。');
    }
    return await response.json();
  },

  // Noteの取得
  async findOne(userId: string, id: number) {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? 'ノート取得に失敗しました。');
    }
    return await response.json();
  },

  // Noteの更新
  async update(id: string, note: {title?: string; content?: string}) {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? 'ノート更新に失敗しました。');
    }
    return await response.json();
  },

  // Noteの削除
  async delete(id: number) {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? 'ノート削除に失敗しました。');
    }
    return true;
  },
};

## 参考、ツールなど

- 参考Gitリポジトリ
https://github.com/kurushiba/notion-clone-ui

- React + Typescriptで超本格的なNotionクローンを作ろうQAボット
https://notebooklm.google.com/notebook/bbdcdcf8-c5c6-4d6b-ab10-e6831ddd7cd4

- VSCode プラグイン
    - ES7+ React/Redux/React-Native snippets
    https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets
    - Auto Close Tag
    https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag

- diffchecker
https://www.diffchecker.com/

- ネーミングツール
https://codic.jp/

- DeepL 翻訳
https://www.deepl.com/ja/translator



## 講座概要

- React Typescript Supabaseを使用した開発
- 基本的なCRUD 検索 リアルタイム通信
- Jotaiを使用したグローバル状態管理

## 備忘メモ

### <a href="./docs/named-or-default-export.md">名前付きエクスポート、デフォルトエクスポート</a>

### `index.html` と `src/main.tsx` の **Vite + React + TypeScriptの標準的な構成**
```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryTextColor': '#000', 'fontSize': '12px'}}}%%
flowchart TD
    A[ブラウザがindex.htmlを読み込み] --> B[main.tsxスクリプトを実行]
    B --> C[Appコンポーネントを読み込み]
    C --> E[root要素にレンダリング]
    E --> F[Reactアプリケーション表示]
    
    style A fill:#e1f5fe
    style F fill:#c8e6c9
```
### React Router

React Routerは、Reactアプリケーションでページ遷移（ルーティング）を実装するための公式ライブラリです。

**URLとコンポーネントの紐付け
→リロードせずにURLの変更、表示内容の切り替え**

使用ファイル
<a href="./src/App.tsx">App.tsx</a>

```js
  return (
    <BrowserRouter>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
          </Route>
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
```

**\<Route>**
パスとコンポーネントを紐づける
```js
<Route path="パス" element={<コンポーネント />} />
```

**\<Routes>**
\<Routes>は複数の\<Route>を囲む親要素
\<Routes>は現在のURLに最も一致する1つのRouteだけを表示します。

### グローバルステートとローカルステートの違い

ローカルステートはプロップスの数が増え、複雑になってしまう欠点がある
↓
グローバルステートで解決（ローカルコンポーネントから外に出すイメージ）

<img src="./docs/global-state.png" width="500" />

#### Jotaiの使い方

<a href="./src/modules/notes/note.state.ts">note.state.ts</a>

**useStateとの違い**

| 項目 | `useState` | `useAtom` |
|------|------------|-----------|
| **スコープ** | コンポーネント内のみ | アプリケーション全体 |
| **共有** | 親子間でpropsで渡す | どこからでも直接アクセス |
| **状態の定義** | コンポーネント内 | 外部で定義可能 |
| **依存関係** | コンポーネントのライフサイクル<br />コンポーネントと一緒に破棄 | 独立 |


### GitHub Pagesデプロイ手順

1. `.github/workflows/deploy.yml`を作成済み
2. Settings → Pages → Source を「GitHub Actions」に設定
3. GitHub Secrets に`VITE_SUPABASE_URL`と`VITE_SUPABASE_API_KEY`を登録
4. `main`または`dev`ブランチにpushすると自動デプロイ
5. デプロイURL: https://idw-coder.github.io/react-notion/

## 手順

- tsconfig.app.jsonを修正

- tailwind.config.jsを作成。

- vite.config.tsの修正

11. リアクトルーターをインストール
```
npm install react-router-dom react-textarea-autosize
```

```
npm install @supabase/supabase-js@2.47.7
```

13. Supabaseのセットアップ
プロジェクト作成

- Supabaseのライブラリのインストール
```
npm install @supabase/supabase-js
```
https://supabase.com/docs/reference/javascript/installing

15. Supabaseの初期化
  - Web管理画面のコンソールでSign In / Providers
  - <a href="./src/lib/supabase.ts">supabase.ts</a>を作成

16. ユーザー登録APIをコーディング<a href="./src/modules/auth/auth.repository.ts">auth.repository.ts</a>

17. ユーザー登録APIをコンポーネントから呼び出す処理をコーディング<a href="./src/pages/Signup.tsx">Signup.tsx</a>

- 質問 async await

18. ログインAPIをコーディング<a href="./src/modules/auth/auth.repository.ts">auth.repository.ts</a>

19. ログインAPIをコンポーネントから呼び出す処理をコーディング<a href="./src/pages/Signin.tsx">Signin.tsx</a>

20. ログイン情報をグローバールステートに
  - Jotaiライブラリを導入
```
npm install jotai
```
21. <a href="src\modules\auth\current-user.state.ts">current-user.state.ts
</a>にAtomを定義してグローバルステートを使用できるように

- ユーザー登録時にログイン情報をグローバルステートに追加する処理をコーディング src\Layout.tsx src\pages\Signup.tsx src\pages\Signin.tsx

- src\modules\auth\auth.repository.ts セッションから現在のユーザーにログイン情報を取得してsrc\App.tsxにわたす

38. src\modules\notes\note.repository.tsに特定のIDノートを取得する処理をコーディング

39. src\pages\NoteDetail.tsx components\TitleInput.tsxにノートのタイトルを表示

40. src\components\TitleInput.tsx src\modules\notes\note.repository.ts タイトル更新できるように

41. src\components\TitleInput.tsx src\modules\notes\note.repository.ts タイトル更新できるように

- 質問 SQL全然使用したことないですが、学習優先度は高いですか？MySQL PostgreSQL

42. BlockNoteインストール
```
npm install @blocknote/core @blocknote/react @blocknote/mantine
```
43. BlockNoteの設定

44. BlockNoteの本文更新処理

45. ノートの詳細ページの遷移をコーディング

46. 検索モーダルの表示

49. Debounce（検索の処理で都度実行されないように）
```
npm install use-debounce
```

50. 検索結果からノート詳細へ遷移

52. 子ノートも削除するSQLをSupabaseに登録

53. グローバルステートの削除

```sql
create or replace function delete_children_notes_recursively(note_id INTEGER)
returns setof notes
language sql
as $$
  WITH RECURSIVE r AS (
        SELECT * FROM notes WHERE id = $1
      UNION ALL
        SELECT notes.* FROM notes, r WHERE notes.parent_document = r.id
  )
  DELETE FROM notes WHERE id IN (SELECT id FROM r) RETURNING *;
$$;




```



---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
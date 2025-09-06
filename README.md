## 参考

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



## 手順

- tsconfig.app.jsonを修正
  - ターゲットのダウンレベル: target が ES2022 → ES2020
  - moduleResolution が bundler → Bundler
大文字小文字の統一。TS 5系の推奨値表記に合わせた形です。
  - モジュール分離: verbatimModuleSyntax 削除、isolatedModules: true 追加
バンドラーフレンドリーな「各ファイル単位で独立にトランスパイル」設定に。
verbatimModuleSyntax を外したことで、インポート/エクスポートの厳密な保持は行わない挙動に変わります。
  - 副作用のない未使用インポート検出: noUncheckedSideEffectImports: true は維持（末尾にカンマ追加のみ）
  - 不要/実験的オプションの除去: erasableSyntaxOnly を削除
  - パスエイリアス追加:
baseUrl: "."
paths: { "@/*": ["./src/*"] }
以後 @/ で src/ を指すインポートが可能になります（例: @/components/Button）。

- tailwind.config.jsを作成
  - darkMode: ['class']: 親要素に class="dark" が付いたときにダークモード用のスタイルを有効化。
  - content: Tailwind がクラスを抽出する対象ファイル。index.html と src 配下の js/ts/jsx/tsx。
  - plugins: Tailwind のプラグイン設定。tailwindcss-animate を使用（@vitejs/plugin-react は本来ここには不要）。
  - theme.extend.colors: CSS変数 --background などを参照する色定義を拡張。popover、card、primary などの色と、チャート用の色セットを用意。
  - theme.extend.borderRadius: 角丸のデフォルト値をCSS変数 --radius を基準に調整（lg/md/sm）。

- vite.config.tsの修正
  - PostCSS に Tailwind CSS を組み込み。@tailwind 指令やユーティリティ生成をビルド時に適用

- リアクトルーターをインストール
```
npm install react-router-dom react-textarea-autosize
```

```
npm install @supabase/supabase-js@2.47.7
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
# ノート操作フロー

このドキュメントでは、React Notionアプリケーションにおけるノートの新規作成、編集、削除のフローについて説明します。

## ノート新規作成フロー

### フロー図

```mermaid
graph TD
    a1[ノート作成] --> a2{作成方法を選択}
    a2 -->|ホーム画面| a3[タイトル入力]
    a2 -->|サイドバー| a4[空のノート作成]
    a2 -->|既存ノートから| a5[子ノート作成]
    
    a3 --> m1[noteRepository.create
    メソッドをコール]
    a4 --> m1
    a5 --> m1
    m1 --> m2[引数で入力したタイトル、
    親のノートIDをわたす]
    m2 --> m3[supabaseのnotesテーブルに
    インサート]

    m3 --> s1[作成されたノートを
    noteStoreに追加]
    s1 --> u1[UI更新完了]

    
classDef smallText font-size:12px
class a1,a2,a3,a4,a5,a6,a7,a8,m1,m2,m3,m4,m5,s1,u1 smallText
```

### 実装詳細

- **ホーム画面での作成**: `src/pages/Home.tsx`でタイトル入力と作成ボタン
- **サイドバーでの作成**: `src/components/SideBar/index.tsx`で空のノート作成
- **子ノート作成**: `src/components/NoteList/index.tsx`で既存ノートの子として作成
- **データ永続化**: `src/modules/notes/note.repository.ts`の`create`メソッド
- **状態管理**: `src/modules/notes/note.state.ts`の`set`メソッド

## ノート編集フロー

### フロー図

```mermaid
graph TD
    A[ユーザーがノートをクリック] --> B[NoteDetailページに遷移]
    B --> C[noteRepository.findOneでノート取得]
    C --> D[noteStoreにノートを設定]
    D --> E[TitleInputコンポーネントで編集開始]
    
    E --> F[タイトル変更]
    F --> G[noteRepository.update呼び出し]
    G --> H[Supabaseでノート更新]
    H --> I[noteStoreに更新されたノートを設定]
    I --> J[UI更新完了]
```

### 実装詳細

- **ノート詳細ページ**: `src/pages/NoteDetail.tsx`
- **タイトル編集**: `src/components/TitleInput.tsx`
- **データ更新**: `src/modules/notes/note.repository.ts`の`update`メソッド
- **状態同期**: 更新後に`noteStore.set`でグローバル状態を更新

## ノート削除フロー

### フロー図

```mermaid
graph TD
    A[ユーザーがノートのメニューを開く] --> B[Deleteボタンをクリック]
    B --> C[削除確認ダイアログ表示]
    C --> D{ユーザーの選択}
    D -->|キャンセル| E[削除をキャンセル]
    D -->|削除確定| F[noteRepository.delete呼び出し]
    F --> G[Supabaseからノート削除]
    G --> H[noteStoreからノートを削除]
    H --> I[UI更新完了]
    E --> J[編集画面に戻る]
```

### 実装状況

- **UI実装**: `src/components/NoteList/NoteItem.tsx`に削除メニューが実装済み
- **未実装**: `noteRepository.delete`メソッドと削除処理のロジック
- **必要な実装**:
  - `src/modules/notes/note.repository.ts`に`delete`メソッド追加
  - `src/modules/notes/note.state.ts`に`remove`メソッド追加
  - 削除確認ダイアログの実装

## 共通のアーキテクチャ

### データフロー

```mermaid
graph LR
    A[UI Component] --> B[noteRepository]
    B --> C[Supabase]
    C --> B
    B --> D[noteStore]
    D --> A
```

### 主要コンポーネント

- **noteRepository**: データベース操作の抽象化
- **noteStore**: グローバル状態管理（Jotai使用）
- **UI Components**: ユーザーインタラクションの処理

### 状態管理の特徴

- **Jotai**を使用したグローバル状態管理
- **noteStore.set**メソッドで既存ノートとの重複を自動的に処理
- リアルタイムでのUI更新を実現

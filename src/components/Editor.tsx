import {
  BlockNoteEditor,
  PartialBlock,
  BlockNoteSchema,
  createCodeBlockSpec,
} from "@blocknote/core";
import { ja } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { createHighlighter } from "@/shiki.bundle";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string | null; // note.contentから
}

function Editor({ onChange, initialContent }: EditorProps) {
  // console.log("取得したinitialContent:", initialContent ? JSON.parse(initialContent) : null);

  /**
   * useCreateBlockNoteはエディタオブジェクトを作成するためのフック（関数）
   * @param {Object} options.dictionary - 辞書
   * @param {Object} options.initialContent - 初期コンテンツ
   * @returns {BlockNoteEditor} BlockNoteEditor
   */
  const editor = useCreateBlockNote({
    dictionary: ja,
    schema: BlockNoteSchema.create().extend({
      blockSpecs: {

        // codeBlockを作成
        codeBlock: createCodeBlockSpec({
          indentLineWithTab: true,
          // defaultLanguage: "typescript",
          // サポートする言語を指定
          supportedLanguages: {
            typescript: { name: "TypeScript", aliases: ["ts"] },
            javascript: { name: "JavaScript", aliases: ["js"] },
            python: { name: "Python", aliases: ["py"] },
            html: { name: "HTML" },
            css: { name: "CSS" },
            php: { name: "PHP", aliases: ["php"] },
          },
          // シンタックスハイライターを作成
          createHighlighter: () =>
            createHighlighter({
              themes: ["github-dark"],
              langs: ["typescript", "javascript", "python", "html", "css", "php"],
            }),
        }),
      },
    }),
    // リロードしてもSupabaseから取得したデータを保持する
    initialContent:
      initialContent != null ? JSON.parse(initialContent) : undefined,
  });
  return (
    <div>
      <BlockNoteView
        editor={editor}
        onChange={() => {
          const content = JSON.stringify(editor.document);
          // デバッグ: コンソールで保存内容を確認
          console.log("Saved document:", editor.document);
          onChange(content);
        }}
        
      />
    </div>
    // https://www.blocknotejs.org/docs/features/blocks/code-blocks
  );
}

export default Editor;

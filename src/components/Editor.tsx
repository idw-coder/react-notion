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
import mermaid from "mermaid";
import { useEffect, useState } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string | null; // note.contentから
}

function Editor({ onChange, initialContent }: EditorProps) {
  // console.log("取得したinitialContent:", initialContent ? JSON.parse(initialContent) : null);

  const [mermaidCode, setMermaidCode] = useState<string>("");
  const [mermaidSvg, setMermaidSvg] = useState<string>("");
  const [mermaidError, setMermaidError] = useState<string>("");

  // Mermaidの初期化
  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'dark',
    });
  }, []);

  // Mermaidコードをレンダリング
  useEffect(() => {
    if (!mermaidCode) {
      setMermaidSvg("");
      return;
    }

    const renderMermaid = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-preview', mermaidCode);
        setMermaidSvg(svg);
        setMermaidError("");
      } catch (error) {
        setMermaidError("Mermaid構文エラー");
        setMermaidSvg("");
      }
    };

    renderMermaid();
  }, [mermaidCode]);

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
            php: { name: "PHP" },
            mermaid: { name: "Mermaid" },
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
      initialContent && initialContent.trim() ? JSON.parse(initialContent) : undefined,
  });

  // エディタの変更を監視してMermaidコードを抽出
  const handleEditorChange = () => {
    const content = editor.document;
    onChange(JSON.stringify(content));

    // Mermaidブロックを探す
    const mermaidBlock = content.find(
      (block: any) => block.type === 'codeBlock' && block.props.language === 'mermaid'
    );

    console.log("Mermaidブロック:", mermaidBlock); // デバッグ用

    if (mermaidBlock && mermaidBlock.content && mermaidBlock.content[0]) {
      const code = mermaidBlock.content.map((c: any) => c.text).join('\n');
      console.log("抽出したMermaidコード:", code); // デバッグ用
      setMermaidCode(code);
    } else {
      setMermaidCode("");
    }
  };

  // 初期表示時にもMermaidコードを抽出
  useEffect(() => {
    if (editor) {
      handleEditorChange();
    }
  }, [editor]);

  return (
    <div className={mermaidCode ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : ""}>
      <div>
        <BlockNoteView
          editor={editor}
          onChange={handleEditorChange}
        />
      </div>
      
      {mermaidCode && (
        <div className="border rounded-lg p-4 bg-gray-900">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">Mermaidプレビュー</h3>
          {mermaidError ? (
            <div className="text-red-400">{mermaidError}</div>
          ) : (
            <div 
              className="mermaid-preview"
              dangerouslySetInnerHTML={{ __html: mermaidSvg }}
            />
          )}
        </div>
      )}
    </div>
    // https://www.blocknotejs.org/docs/features/blocks/code-blocks
  );
}

export default Editor;

import { atom, useAtom } from "jotai";
import { Note } from "./note.entity";

/**
 * ノートの状態を管理するアトム
 * @type {Note[]} ノートの配列を格納
 * @description アプリケーション全体でノートの状態を一元管理
 * @example
 * // 初期状態
 * const notes = []; // 空配列
 * 
 * // ノートが追加された状態
 * const notes = [
 *   { id: 1, title: "ノート1", content: "内容1" },
 *   { id: 2, title: "ノート2", content: "内容2" }
 * ];
 */
const noteAtom = atom<Note[]>([]);

export const useNoteStore = () => {
    const [notes, setNotes] = useAtom(noteAtom);

    const set = (newNotes: Note[]) => {
        setNotes((oldNotes) => {

            /** 
             * マージ
             * 例）oldNotes = [note1, note2, note3], newNotes = [note3, note4, note5, note6]
             * マージ後 = [note1, note2, note3, note4, note5, note6]
             */
            const combineNotes = [...oldNotes, ...newNotes];

            /**
             * オブジェクト化するため
             * 例）combineNotes = [note1, note2, note3, note3, note4, note5, note6]
             * オブジェクト化後 = { 1: note1, 2: note2, 3: note3, 4: note4, 5: note5, 6: note6 }
             * キーが3のように既にある場合は値は上書きされる
             */
            const uniqueNotes: { [key: string]: Note } = {};
            for (const note of combineNotes) {
                uniqueNotes[note.id] = note;
            }
            return Object.values(uniqueNotes);
        });
    }

    // TODO: ここ複雑
    const deleteNote = (id: number) => {
        const findChildrenIds = (parentId: number): number[] => {

            // ストアのnotesから親IDがparentIdのノートを取得
            const childrenIds = notes
                .filter((note) => note.parent_document === parentId)
                .map((child) => child.id); // 子ノートのID配列を取得

            // concat() は配列を結合して新しい配列を作るメソッド
            return childrenIds.concat(
                ...childrenIds.map((childId) => findChildrenIds(childId))
            )
        }
        const childrenIds = findChildrenIds(id);

        setNotes((oldNotes) =>
            // 引数のidと一致するノートと、その子ノートを除外した配列を返す
            oldNotes.filter((note) => ![id, ...childrenIds].includes(note.id))
        );
    };

    const getOne = (id: number) => notes.find((note ) => note.id == id);
    const clear = () => setNotes([]);

    return {
        getAll: () => notes,
        getOne: (id: number) => getOne(id),
        set,
        delete: (id: number) => deleteNote(id),
        clear,
    };
};

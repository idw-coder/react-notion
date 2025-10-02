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

    const getOne = (id: number) => notes.find((note ) => note.id == id);

    return {
        getAll: () => notes,
        getOne: (id: number) => getOne(id),
        set,
    };
};

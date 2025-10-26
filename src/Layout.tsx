import { Navigate, Outlet } from 'react-router-dom';
import SideBar from './components/SideBar';
import { SearchModal } from './components/SearchModal';
import { useCurrentUserStore } from './modules/auth/current-user.state';
import { useNoteStore } from './modules/notes/note.state';
import { useState, useEffect } from 'react';
import { noteRepository } from './modules/notes/note.repository';
import { Note } from './modules/notes/note.mysql.entity';
import { useNavigate } from 'react-router-dom';
// import { subscribe, unsubscribe } from './lib/supabase';
import { subscribe, unsubscribe } from './lib/note-polling.ts';

const Layout = () => {

  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser == null) {
      console.log('ユーザーが存在しないためノートを取得しない');
      return;
    }
    fetchNotes();

    // TODO: 理解
    // ページのロード時にチャンネルを作成
    const channel = subscribeNote();
    return () => {
      // コンポーネントが破棄されるタイミングでチャンネルを破棄
      unsubscribe(channel!);
    }
  }, []);

  const subscribeNote = () => {
    if (currentUser == null) return;

    /**
     * payloadはSupabaseのリアルタイム機能によって自動的に提供されるオブジェクト
     * データベースの変更イベント（INSERT、UPDATE、DELETE）に関する情報を含む
     * - eventType: イベントの種類（'INSERT'、'UPDATE'、'DELETE'など）
     * - new: 新しいレコードのデータ（INSERTやUPDATEの場合）
     * - old: 古いレコードのデータ（UPDATEやDELETEの場合）
     */
    return subscribe(currentUser!.id, (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        noteStore.set([payload.new]);
      } else if (payload.eventType === 'DELETE') {
        noteStore.delete(payload.old.id!);
      }
    });
  }

  const fetchNotes = async () => {
    setIsLoading(true);
    const notes = await noteRepository.find(currentUser!.id);
    if (currentUser) {
      console.log('currentUser', currentUser);
    }
    if (notes == null) return;
    noteStore.set(notes);
    setIsLoading(false);
  }

  const searchNotes = async (keyword: string) => {
    const notes = await noteRepository.findByKeyword(currentUser!.id, keyword);
    if (notes == null) return;
    noteStore.set(notes);
    setSearchResults(notes ?? []);
  }

  const moveToDetail = (noteId: number) => {
    navigate(`/notes/${noteId}`);
    setIsSearchModalOpen(false);
  }

  // Navigateはページ遷移を行うコンポーネント
  // replaceはページ遷移を行うときに、前のページを破棄する
  // toは遷移先のパス
  if (currentUser == null) return <Navigate replace to="/signin" />;

  return (

    <div className="h-full flex">
      {!isLoading && <SideBar onSearchButtonClicked={() => setIsSearchModalOpen(true)}/>}
      <main className="flex-1 h-full overflow-y-auto">
        <Outlet />
        <SearchModal
          isOpen={isSearchModalOpen}
          notes={searchResults}
          onItemSelect={moveToDetail}
          onKeywordChanged={searchNotes}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default Layout;

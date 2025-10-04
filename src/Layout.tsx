import { Navigate, Outlet } from 'react-router-dom';
import SideBar from './components/SideBar';
import { SearchModal } from './components/SearchModal';
import { useCurrentUserStore } from './modules/auth/current-user.state';
import { useNoteStore } from './modules/notes/note.state';
import { useState, useEffect } from 'react';
import { noteRepository } from './modules/notes/note.repository';
import { Note } from './modules/notes/note.entity';
import { useNavigate } from 'react-router-dom';

const Layout = () => {

  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    const notes = await noteRepository.find(currentUser!.id);
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

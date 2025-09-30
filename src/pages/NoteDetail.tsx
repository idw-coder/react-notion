import { TitleInput } from '@/components/TitleInput';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { noteRepository } from '@/modules/notes/note.repository';
import { useCurrentUserStore } from '@/modules/auth/current-user.state';
import { useNoteStore } from '@/modules/notes/note.state';

const NoteDetail = () => {
  const params = useParams(); // URLのパラメータを取得
  const id = parseInt(params.id!);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore();
  const note = noteStore.getOne(id);

  useEffect(() => {
    fetchOne();
  }, [id]); // idが変化した時にfetchOneを実行

  const fetchOne = async () => {
    setIsLoading(true);
    const note = await noteRepository.findOne(currentUser!.id, id);
    if (note == null) return;

    // supabaseから取得したデータをグローバルストアnoteStoreに設定
    noteStore.set([note]);
    setIsLoading(false);
  }

  if (isLoading) return <div>Loading...</div>;
  if (note == null) {
    setIsLoading(false);
    return (
        <div>Note not found</div>
    )
  }
  console.log(note);

  return (
    <div className="pb-40 pt-20">
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <TitleInput initialData={note} />
      </div>
    </div>
  );
};

export default NoteDetail;

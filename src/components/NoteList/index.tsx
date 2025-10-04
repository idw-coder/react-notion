import { cn } from '@/lib/utils';
import { NoteItem } from './NoteItem';
import { useNoteStore } from '@/modules/notes/note.state';
import { useCurrentUserStore } from '@/modules/auth/current-user.state';
import { noteRepository } from '@/modules/notes/note.repository';
import { Note } from '@/modules/notes/note.entity';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ページ遷移を行う

interface NoteListProps {
  layer?: number;
  parentId?: number;
}

export function NoteList({ layer = 0, parentId }: NoteListProps) {
  const navigate = useNavigate();
  const noteStore = useNoteStore();
  const notes = noteStore.getAll();
  const { currentUser } = useCurrentUserStore();
  const [expandec, setExpanded] = useState<Map<Number, boolean>>(new Map());

  const createChild = async (e: React.MouseEvent, parentId: number) => {
    e.stopPropagation(); // 親のノートをクリックした時にも呼ばれないようにする
    const newNote = await noteRepository.create(currentUser!.id, { parentId });
    noteStore.set([newNote]);
    setExpanded((prev) => {
      prev.set(parentId, true);
      return prev;
    });
    moveToDetail(newNote.id);
  }

  const fetchChildren = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    const children = await noteRepository.find(currentUser!.id, note.id);
    if (children == null) return;
    noteStore.set(children);
    setExpanded((prev) => {
      const newExpanded = new Map(prev);
      // トグル
      newExpanded.set(note.id, !prev.get(note.id));
      return newExpanded;
    });
  }

  const moveToDetail = (noteId: number) => {
    navigate(`/notes/${noteId}`);
  }

  return (
    <>
      <p
        className={cn(
          `hidden text-sm font-medium text-muted-foreground/80`,
          layer === 0 && 'hidden'
        )}
        style={{ paddingLeft: layer ? `${layer * 12 + 25}px` : undefined }}
      >
        ページがありません
      </p>
      {notes
      .filter((note) => note.parent_document == parentId)
      .map((note) => {
        return (
          <div key={note.id}>
            <NoteItem layer={layer} note={note} 
              onCreate={(e) => createChild(e, note.id)}
              onExpand={(e: React.MouseEvent) => fetchChildren(e, note)}
              expanded={expandec.get(note.id)}
              onClick={() => moveToDetail(note.id) }
            />
            {expandec.get(note.id) && (
              <NoteList layer={layer + 1} parentId={note.id} />
            )}
          </div>
        );
      })}
    </>
  );
}

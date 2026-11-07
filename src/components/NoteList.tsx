import type { Note } from '../features/notes/types'
import { Icon } from './Icon'

interface NoteListProps {
  notes: Note[]
  selectedNoteId: string | null
  hasSearch: boolean
  onSelect: (note: Note) => void
  onDelete: (note: Note) => void
}

const noteDateFormatter = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function getNotePreview(content: string): string {
  return content.trim() || 'Sin contenido todavía'
}

export function NoteList({
  notes,
  selectedNoteId,
  hasSearch,
  onSelect,
  onDelete,
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="list-empty">
        <span className="empty-icon">
          <Icon name="search" size={19} />
        </span>
        <p>{hasSearch ? 'No hay resultados' : 'Aún no tienes notas'}</p>
        <span>
          {hasSearch
            ? 'Prueba con otros términos de búsqueda.'
            : 'Tus notas nuevas aparecerán aquí.'}
        </span>
      </div>
    )
  }

  return (
    <ul className="note-list">
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId

        return (
          <li key={note.id}>
            <div className={`note-card${isSelected ? ' is-selected' : ''}`}>
              <button
                type="button"
                className="note-card-main"
                onClick={() => onSelect(note)}
                aria-current={isSelected ? 'true' : undefined}
              >
                <span className="note-card-topline">
                  <span className="note-card-icon">
                    <Icon name="file" size={16} />
                  </span>
                  <span className="note-card-date">
                    {noteDateFormatter.format(new Date(note.updatedAt))}
                  </span>
                </span>
                <span className="note-card-title">{note.title || 'Sin título'}</span>
                <span className="note-card-preview">
                  {getNotePreview(note.content)}
                </span>
              </button>
              <button
                type="button"
                className="note-delete-button"
                aria-label={`Eliminar nota ${note.title || 'Sin título'}`}
                title="Eliminar nota"
                onClick={() => onDelete(note)}
              >
                <Icon name="trash" size={16} />
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Note } from '../features/notes/types'
import { Icon } from './Icon'

interface NoteEditorProps {
  note: Note | null
  onSave: (draft: { title: string; content: string }) => void
  onCancel: () => void
}

const dateTimeFormatter = new Intl.DateTimeFormat('es', {
  dateStyle: 'long',
  timeStyle: 'short',
})

function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value))
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({ title, content })
  }

  return (
    <form className="editor-card" onSubmit={handleSubmit}>
      <div className="editor-header">
        <div className="editor-breadcrumb">
          <span>Mis notas</span>
          <span className="breadcrumb-divider">/</span>
          <span>{note ? 'Editar nota' : 'Nueva nota'}</span>
        </div>
        <span className="saved-badge">
          <span className="status-dot" />
          Se guarda localmente
        </span>
      </div>

      <label className="field-label" htmlFor="note-title">
        TÍTULO
      </label>
      <input
        id="note-title"
        className="title-input"
        type="text"
        maxLength={120}
        placeholder="Ponle un título a tu nota"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <div className="editor-divider" />

      <label className="field-label content-label" htmlFor="note-content">
        CONTENIDO
      </label>
      <textarea
        id="note-content"
        className="content-input"
        placeholder="Empieza a escribir aquí..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />

      <footer className="editor-footer">
        <div className="note-timestamps" aria-live="polite">
          {note ? (
            <>
              <span>
                <Icon name="calendar" size={15} />
                Creada {formatDateTime(note.createdAt)}
              </span>
              <span>
                <Icon name="calendar" size={15} />
                Modificada {formatDateTime(note.updatedAt)}
              </span>
            </>
          ) : (
            <span className="new-note-hint">
              <Icon name="lock" size={15} />
              Solo tú puedes ver esta nota en este dispositivo
            </span>
          )}
        </div>
        <div className="editor-actions">
          <button className="cancel-button" type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="save-button" type="submit">
            <Icon name="save" size={16} />
            Guardar nota
          </button>
        </div>
      </footer>
    </form>
  )
}

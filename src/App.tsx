import { useMemo, useState } from 'react'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Icon } from './components/Icon'
import { NoteEditor } from './components/NoteEditor'
import { NoteList } from './components/NoteList'
import {
  filterAndSortNotes,
  type SortOrder,
} from './features/notes/noteUtils'
import { loadNotes, saveNotes } from './features/notes/storage'
import type { Note } from './features/notes/types'
import './App.css'

const initialNotes = loadNotes()

function App() {
  const [notes, setNotes] = useState(initialNotes.notes)
  const [storageError, setStorageError] = useState(initialNotes.error ?? '')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('created-desc')
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)

  const visibleNotes = useMemo(
    () => filterAndSortNotes(notes, search, sortOrder),
    [notes, search, sortOrder],
  )
  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null

  function persistNotes(nextNotes: Note[]) {
    try {
      saveNotes(nextNotes)
      setNotes(nextNotes)
      setStorageError('')
      return true
    } catch {
      setStorageError(
        'No se pudieron guardar los cambios. Comprueba el almacenamiento del navegador e inténtalo de nuevo.',
      )
      return false
    }
  }

  function handleSaveNote(draft: { title: string; content: string }) {
    const now = new Date().toISOString()
    const title = draft.title.trim() || 'Sin título'
    const existingNote = isCreating ? null : selectedNote

    const updatedNote: Note = existingNote
      ? { ...existingNote, title, content: draft.content, updatedAt: now }
      : {
          id: crypto.randomUUID(),
          title,
          content: draft.content,
          createdAt: now,
          updatedAt: now,
        }

    const nextNotes = existingNote
      ? notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      : [updatedNote, ...notes]

    if (persistNotes(nextNotes)) {
      setSelectedNoteId(updatedNote.id)
      setIsCreating(false)
    }
  }

  function handleDeleteNote() {
    if (!noteToDelete) return

    const nextNotes = notes.filter((note) => note.id !== noteToDelete.id)
    if (persistNotes(nextNotes)) {
      setSelectedNoteId(null)
      setIsCreating(false)
      setNoteToDelete(null)
    }
  }

  function handleCreateNote() {
    setSelectedNoteId(null)
    setIsCreating(true)
  }

  function handleCancelEditor() {
    setIsCreating(false)
    setSelectedNoteId(null)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a
          className="brand"
          href={import.meta.env.BASE_URL}
          aria-label="Notas — inicio"
          onClick={(event) => {
            event.preventDefault()
            handleCancelEditor()
          }}
        >
          <span className="brand-mark">
            <Icon name="notebook" size={23} />
          </span>
          <span>notas<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-note">
          <span className="status-dot" />
          Tus ideas, siempre a mano
        </div>
      </header>

      <div className="workspace">
        <aside className="notes-panel" aria-label="Tus notas">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">TU ESPACIO</p>
              <h1>Tus notas</h1>
            </div>
            <button
              className="new-note-button"
              type="button"
              onClick={handleCreateNote}
            >
              <Icon name="plus" size={17} />
              <span>Nueva nota</span>
            </button>
          </div>

          <label className="search-box">
            <Icon name="search" size={18} />
            <input
              type="search"
              placeholder="Buscar en tus notas"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar por título o contenido"
            />
            {search && (
              <button
                type="button"
                className="clear-search"
                aria-label="Limpiar búsqueda"
                onClick={() => setSearch('')}
              >
                <Icon name="close" size={15} />
              </button>
            )}
          </label>

          <div className="list-toolbar">
            <span className="note-count">
              {visibleNotes.length} {visibleNotes.length === 1 ? 'nota' : 'notas'}
            </span>
            <label className="sort-control">
              <Icon name="sort" size={16} />
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOrder)
                }
                aria-label="Ordenar notas"
              >
                <option value="created-desc">Más recientes</option>
                <option value="created-asc">Más antiguas</option>
                <option value="title-asc">Nombre A-Z</option>
                <option value="title-desc">Nombre Z-A</option>
              </select>
            </label>
          </div>

          {storageError && (
            <p className="storage-alert" role="alert">
              {storageError}
            </p>
          )}

          <NoteList
            notes={visibleNotes}
            selectedNoteId={selectedNoteId}
            hasSearch={Boolean(search.trim())}
            onSelect={(note) => {
              setIsCreating(false)
              setSelectedNoteId(note.id)
            }}
            onDelete={setNoteToDelete}
          />

          <p className="local-storage-note">
            <Icon name="lock" size={15} />
            Guardadas solo en este dispositivo
          </p>
        </aside>

        <section className="editor-panel" aria-label="Editor de notas">
          {isCreating || selectedNote ? (
            <NoteEditor
              key={isCreating ? 'new-note' : selectedNote?.id}
              note={isCreating ? null : selectedNote}
              onSave={handleSaveNote}
              onCancel={handleCancelEditor}
            />
          ) : (
            <div className="welcome-card">
              <div className="welcome-illustration">
                <div className="paper paper-back" />
                <div className="paper paper-front">
                  <span />
                  <span />
                  <span />
                  <span className="paper-short-line" />
                </div>
                <span className="sparkle sparkle-one">✦</span>
                <span className="sparkle sparkle-two">✧</span>
              </div>
              <p className="eyebrow">UN LUGAR PARA TUS IDEAS</p>
              <h2>{search ? 'No encontramos esa nota' : 'Empieza por una idea'}</h2>
              <p className="welcome-copy">
                {search
                  ? 'Prueba con otras palabras o limpia la búsqueda.'
                  : 'Crea una nota nueva o selecciona una de tu lista para continuar.'}
              </p>
              {!search && (
                <button
                  className="new-note-button welcome-button"
                  type="button"
                  onClick={handleCreateNote}
                >
                  <Icon name="plus" size={17} />
                  Crear mi primera nota
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {noteToDelete && (
        <ConfirmDialog
          noteTitle={noteToDelete.title}
          onCancel={() => setNoteToDelete(null)}
          onConfirm={handleDeleteNote}
        />
      )}
    </main>
  )
}

export default App

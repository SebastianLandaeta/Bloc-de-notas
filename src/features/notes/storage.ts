import type { Note } from './types'

const STORAGE_KEY = 'notas-app:notes'

export interface LoadNotesResult {
  notes: Note[]
  error?: string
}

function isNote(value: unknown): value is Note {
  if (typeof value !== 'object' || value === null) return false

  const note = value as Record<string, unknown>
  return (
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.content === 'string' &&
    typeof note.createdAt === 'string' &&
    !Number.isNaN(Date.parse(note.createdAt)) &&
    typeof note.updatedAt === 'string' &&
    !Number.isNaN(Date.parse(note.updatedAt))
  )
}

export function loadNotes(): LoadNotesResult {
  try {
    const storedNotes = window.localStorage.getItem(STORAGE_KEY)
    if (storedNotes === null) return { notes: [] }

    const parsed: unknown = JSON.parse(storedNotes)
    if (!Array.isArray(parsed) || !parsed.every(isNote)) {
      return {
        notes: [],
        error:
          'Los datos guardados no tienen un formato válido. Al guardar una nota nueva se reemplazarán.',
      }
    }

    return { notes: parsed }
  } catch {
    return {
      notes: [],
      error:
        'No se pudieron leer las notas guardadas. Comprueba el almacenamiento del navegador.',
    }
  }
}

export function saveNotes(notes: Note[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

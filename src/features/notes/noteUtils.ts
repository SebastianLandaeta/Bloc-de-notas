import type { Note } from './types'

export type SortOrder =
  | 'title-asc'
  | 'title-desc'
  | 'created-asc'
  | 'created-desc'

export function filterAndSortNotes(
  notes: Note[],
  search: string,
  sortOrder: SortOrder,
): Note[] {
  const query = search.trim().toLocaleLowerCase()
  const filteredNotes = query
    ? notes.filter(
        (note) =>
          note.title.toLocaleLowerCase().includes(query) ||
          note.content.toLocaleLowerCase().includes(query),
      )
    : [...notes]

  return filteredNotes.sort((first, second) => {
    switch (sortOrder) {
      case 'title-asc':
        return first.title.localeCompare(second.title, 'es')
      case 'title-desc':
        return second.title.localeCompare(first.title, 'es')
      case 'created-asc':
        return first.createdAt.localeCompare(second.createdAt)
      case 'created-desc':
        return second.createdAt.localeCompare(first.createdAt)
    }
  })
}

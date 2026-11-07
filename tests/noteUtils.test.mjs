import assert from 'node:assert/strict'
import test from 'node:test'
import { filterAndSortNotes } from '../src/features/notes/noteUtils.ts'

const notes = [
  {
    id: '1',
    title: 'Viaje',
    content: 'Llevar una libreta',
    createdAt: '2025-01-03T10:00:00.000Z',
    updatedAt: '2025-01-03T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Ideas',
    content: 'Plan para el viaje',
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-01-01T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'Compras',
    content: 'Fruta y café',
    createdAt: '2025-01-02T10:00:00.000Z',
    updatedAt: '2025-01-02T10:00:00.000Z',
  },
]

test('filters by title or content without case sensitivity', () => {
  assert.deepEqual(
    filterAndSortNotes(notes, 'VIAJE', 'title-asc').map((note) => note.id),
    ['2', '1'],
  )
})

test('sorts by title in ascending and descending order', () => {
  assert.deepEqual(
    filterAndSortNotes(notes, '', 'title-asc').map((note) => note.title),
    ['Compras', 'Ideas', 'Viaje'],
  )
  assert.deepEqual(
    filterAndSortNotes(notes, '', 'title-desc').map((note) => note.title),
    ['Viaje', 'Ideas', 'Compras'],
  )
})

test('sorts by creation date in both directions', () => {
  assert.deepEqual(
    filterAndSortNotes(notes, '', 'created-desc').map((note) => note.id),
    ['1', '3', '2'],
  )
  assert.deepEqual(
    filterAndSortNotes(notes, '', 'created-asc').map((note) => note.id),
    ['2', '3', '1'],
  )
})

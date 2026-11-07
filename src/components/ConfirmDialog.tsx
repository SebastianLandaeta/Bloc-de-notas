import { useEffect, useRef } from 'react'
import { Icon } from './Icon'

interface ConfirmDialogProps {
  noteTitle: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  noteTitle,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="dialog-backdrop">
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <span className="dialog-icon">
          <Icon name="trash" size={21} />
        </span>
        <h2 id="delete-dialog-title">¿Eliminar esta nota?</h2>
        <p id="delete-dialog-description">
          <strong>“{noteTitle}”</strong> se eliminará permanentemente de este
          dispositivo. Esta acción no se puede deshacer.
        </p>
        <div className="dialog-actions">
          <button
            ref={cancelButtonRef}
            className="cancel-button"
            type="button"
            onClick={onCancel}
          >
            Conservar nota
          </button>
          <button
            className="delete-confirm-button"
            type="button"
            onClick={onConfirm}
          >
            Eliminar nota
          </button>
        </div>
      </section>
    </div>
  )
}

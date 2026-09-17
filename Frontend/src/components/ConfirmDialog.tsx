import { useEffect, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react'
import { Button } from './Button'

type Props = {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Modal confirmation built on the native <dialog>; Escape and a backdrop click cancel it. */
export function ConfirmDialog({ open, title, children, confirmLabel, busy = false, onConfirm, onCancel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      cancelRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget && !busy) onCancel()
  }

  const handleClose = () => {
    if (open) onCancel()
  }

  // Escape must not dismiss the dialog while the request is in flight
  const handleCancelEvent = (event: SyntheticEvent<HTMLDialogElement>) => {
    if (busy) event.preventDefault()
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="confirm-dialog-title"
      onClick={handleBackdropClick}
      onCancel={handleCancelEvent}
      onClose={handleClose}
    >
      <div className="dialog__panel">
        <h2 id="confirm-dialog-title" className="dialog__title">
          {title}
        </h2>
        <div className="dialog__body">{children}</div>
        <div className="dialog__actions">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" className="btn--solid" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}

import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type ToastApi, type ToastKind } from '../hooks/useToast'
import { AlertIcon, CheckIcon, CloseIcon } from './Icons'

type Toast = { id: number; kind: ToastKind; message: string }

const TOAST_DURATION_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId.current
      nextId.current += 1
      setToasts((current) => [...current, { id, kind, message }])
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS)
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
    }),
    [push],
  )

  return (
    <ToastContext value={api}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.kind}`}>
            {toast.kind === 'success' ? <CheckIcon size={18} /> : <AlertIcon size={18} />}
            <span className="toast__message">{toast.message}</span>
            <button type="button" className="toast__close" onClick={() => dismiss(toast.id)} aria-label="Dismiss">
              <CloseIcon size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  )
}

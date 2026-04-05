import { useEffect, useRef, useCallback, useState } from 'react'

interface AutoSaveOptions {
  data: string | null
  onSave: (data: string) => Promise<void>
  debounceMs?: number
  enabled?: boolean
}

/**
 * Auto-saves editor content after a debounce period.
 * Tracks the last-saved timestamp and saving state.
 */
export function useAutoSave({ data, onSave, debounceMs = 3000, enabled = true }: AutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const lastDataRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback(async (content: string) => {
    setIsSaving(true)
    try {
      await onSave(content)
      setLastSaved(new Date().toLocaleTimeString())
      lastDataRef.current = content
    } catch {
      // silently fail; user can manually retry
    } finally {
      setIsSaving(false)
    }
  }, [onSave])

  useEffect(() => {
    if (!enabled || !data || data === lastDataRef.current) return

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => { save(data) }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [data, debounceMs, enabled, save])

  const manualSave = useCallback(() => {
    if (data && data !== lastDataRef.current) save(data)
  }, [data, save])

  return { isSaving, lastSaved, manualSave }
}

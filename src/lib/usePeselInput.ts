import { useState, useCallback } from 'react'
import { isValidPesel, checkGender, getDateOfBirth } from 'pesel-utils'

export interface PeselMeta {
  isValid: boolean
  gender?: 'male' | 'female'
  dateOfBirth?: string
}

export interface UsePeselInputOptions {
  value?: string
  defaultValue?: string
  onChange?: (value: string, meta: PeselMeta) => void
}

function computeMeta(value: string): PeselMeta {
  if (value.length !== 11) return { isValid: false }
  const valid = isValidPesel(value)
  if (!valid) return { isValid: false }
  return {
    isValid: true,
    gender: checkGender(value),
    dateOfBirth: getDateOfBirth(value),
  }
}

export function usePeselInput({ value: controlledValue, defaultValue = '', onChange }: UsePeselInputOptions = {}) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
      if (!isControlled) setInternalValue(raw)
      onChange?.(raw, computeMeta(raw))
    },
    [isControlled, onChange],
  )

  const meta = computeMeta(value)
  const isComplete = value.length === 11

  return {
    inputProps: {
      value,
      onChange: handleChange,
      inputMode: 'numeric' as const,
      maxLength: 11,
      'data-valid': isComplete ? String(meta.isValid) : undefined,
      'data-complete': isComplete ? '' : undefined,
    },
    meta,
    isComplete,
  }
}

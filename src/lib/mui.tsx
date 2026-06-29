import { forwardRef } from 'react'
import { TextField, type TextFieldProps } from '@mui/material'
import { usePeselInput, type PeselMeta } from './usePeselInput'

export interface MuiPeselInputProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'defaultValue'> {
  value?: string
  defaultValue?: string
  onChange?: (value: string, meta: PeselMeta) => void
  invalidMessage?: string
}

const MuiPeselInput = forwardRef<HTMLInputElement, MuiPeselInputProps>(function MuiPeselInput(
  { value, defaultValue, onChange, invalidMessage = 'Nieprawidłowy numer PESEL', ...rest },
  ref,
) {
  const { inputProps, meta, isComplete } = usePeselInput({ value, defaultValue, onChange })
  const showError = isComplete && !meta.isValid
  return (
    <TextField
      {...rest}
      inputProps={{ ...rest.inputProps, ...inputProps }}
      inputRef={ref}
      error={rest.error ?? showError}
      helperText={rest.helperText ?? (showError ? invalidMessage : undefined)}
    />
  )
})

export default MuiPeselInput

import { forwardRef } from 'react'
import { TextInput, type TextInputProps } from '@mantine/core'
import { usePeselInput, type PeselMeta } from './usePeselInput'

export interface MantinePeselInputProps extends Omit<TextInputProps, 'onChange' | 'value' | 'defaultValue'> {
  value?: string
  defaultValue?: string
  onChange?: (value: string, meta: PeselMeta) => void
  invalidMessage?: string
}

const MantinePeselInput = forwardRef<HTMLInputElement, MantinePeselInputProps>(function MantinePeselInput(
  { value, defaultValue, onChange, invalidMessage = 'Nieprawidłowy numer PESEL', ...rest },
  ref,
) {
  const { inputProps, meta, isComplete } = usePeselInput({ value, defaultValue, onChange })
  return (
    <TextInput
      {...rest}
      {...inputProps}
      ref={ref}
      error={rest.error ?? (isComplete && !meta.isValid ? invalidMessage : undefined)}
    />
  )
})

export default MantinePeselInput

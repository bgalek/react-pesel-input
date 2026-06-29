import { forwardRef } from 'react'
import { usePeselInput, type PeselMeta } from './usePeselInput'

export interface PeselInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue'> {
  value?: string
  defaultValue?: string
  onChange?: (value: string, meta: PeselMeta) => void
}

const PeselInput = forwardRef<HTMLInputElement, PeselInputProps>(function PeselInput(
  { value, defaultValue, onChange, ...rest },
  ref,
) {
  const { inputProps } = usePeselInput({ value, defaultValue, onChange })
  return <input type="text" {...rest} {...inputProps} ref={ref} />
})

export default PeselInput

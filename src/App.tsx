import { useState } from 'react'
import { PeselInput, usePeselInput, type PeselMeta } from './lib/index'
import './lib/styles.css'

function ControlledExample() {
  const [value, setValue] = useState('')
  const [meta, setMeta] = useState<PeselMeta>({ isValid: false })

  function handleChange(v: string, m: PeselMeta) {
    setValue(v)
    setMeta(m)
  }

  return (
    <section>
      <h2>Controlled PeselInput</h2>
      <div className="pesel-input">
        <label className="pesel-input__label" htmlFor="pesel-controlled">
          PESEL
        </label>
        <PeselInput
          id="pesel-controlled"
          className="pesel-input__field"
          value={value}
          onChange={handleChange}
          placeholder="00000000000"
        />
        {value.length === 11 && (
          <span className={meta.isValid ? 'pesel-input__hint' : 'pesel-input__error'}>
            {meta.isValid
              ? `Valid — gender: ${meta.gender}, born: ${meta.dateOfBirth}`
              : 'Invalid PESEL number'}
          </span>
        )}
      </div>
      <pre style={{ marginTop: '1rem', fontSize: '0.75rem' }}>{JSON.stringify({ value, meta }, null, 2)}</pre>
    </section>
  )
}

function HookExample() {
  const { inputProps, meta, isComplete } = usePeselInput()
  return (
    <section>
      <h2>usePeselInput hook (uncontrolled)</h2>
      <div className="pesel-input">
        <label className="pesel-input__label" htmlFor="pesel-hook">
          PESEL
        </label>
        <input id="pesel-hook" className="pesel-input__field" {...inputProps} placeholder="00000000000" />
        {isComplete && (
          <span className={meta.isValid ? 'pesel-input__hint' : 'pesel-input__error'}>
            {meta.isValid ? `Valid — ${meta.gender}, ${meta.dateOfBirth}` : 'Invalid PESEL number'}
          </span>
        )}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <main style={{ maxWidth: '480px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>react-pesel-input demo</h1>
      <ControlledExample />
      <hr style={{ margin: '2rem 0' }} />
      <HookExample />
    </main>
  )
}

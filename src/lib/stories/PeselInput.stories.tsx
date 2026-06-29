import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { PeselInput, usePeselInput, type PeselMeta } from '../index'
import '../styles.css'

const meta: Meta = {
  title: 'PeselInput',
  parameters: {
    docs: {
      description: {
        component:
          'Headless PESEL input. Strips non-digits, enforces max 11 digits, and validates via `pesel-utils`. Style it with the bundled CSS or any design system — or wire it up via `usePeselInput`.',
      },
    },
  },
}

export default meta

export const Headless: StoryObj = {
  name: 'Headless',
  parameters: {
    docs: {
      description: {
        story:
          'Zero JavaScript in the consumer — `PeselInput` sets `data-complete` and `data-valid` on the underlying `<input>`. Target those attributes in CSS to drive all visual states.',
      },
    },
  },
  render: function HeadlessStory() {
    return (
      <>
        <style>{`
          .demo { font-family: monospace; font-size: 1rem; padding: 0.4rem 0.6rem; border: 2px solid #d1d5db; border-radius: 6px; outline: none; }
          .demo:focus { border-color: #6366f1; }
          .demo[data-complete][data-valid="true"]  { border-color: #22c55e; }
          .demo[data-complete][data-valid="false"] { border-color: #ef4444; }
        `}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Empty</label>
            <PeselInput className="demo" placeholder="00000000000" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Valid PESEL</label>
            <PeselInput className="demo" defaultValue="44051401359" placeholder="00000000000" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Invalid PESEL</label>
            <PeselInput className="demo" defaultValue="12345678901" placeholder="00000000000" />
          </div>
        </div>
      </>
    )
  },
}

export const DefaultStyles: StoryObj = {
  name: 'Default styles',
  parameters: {
    docs: {
      description: {
        story:
          'Import `react-pesel-input/styles.css` and apply the `pesel-input__*` BEM class names. The border turns green or red automatically via CSS attribute selectors.',
      },
    },
  },
  render: function DefaultStylesStory() {
    const [meta, setMeta] = useState<PeselMeta>({ isValid: false })
    const [isComplete, setIsComplete] = useState(false)

    function handleChange(value: string, m: PeselMeta) {
      setMeta(m)
      setIsComplete(value.length === 11)
    }

    return (
      <div className="pesel-input" style={{ width: 320 }}>
        <label className="pesel-input__label" htmlFor="pesel-default">PESEL</label>
        <PeselInput id="pesel-default" className="pesel-input__field" placeholder="00000000000" onChange={handleChange} />
        {isComplete && meta.isValid && (
          <span className="pesel-input__hint">
            {meta.gender === 'male' ? 'Male' : 'Female'} — born {meta.dateOfBirth}
          </span>
        )}
        {isComplete && !meta.isValid && (
          <span className="pesel-input__error">Invalid PESEL number</span>
        )}
      </div>
    )
  },
}


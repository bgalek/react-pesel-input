import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useForm as useTanstackForm } from '@tanstack/react-form'
import { isValidPesel } from 'pesel-utils'
import { PeselInput, type PeselMeta } from '../index'
import MantinePeselInput from '../mantine'
import '../styles.css'

const meta: Meta = {
  title: 'Form Integrations',
  parameters: {
    docs: {
      description: {
        component:
          '`PeselInput` works with any form library. The `onChange` callback receives a clean digit-only string and a `PeselMeta` object — no extra transforms needed.',
      },
    },
  },
}

export default meta

export const ReactHookForm: StoryObj = {
  name: 'react-hook-form',
  parameters: {
    docs: {
      description: {
        story: 'Use `Controller` to bridge react-hook-form with `PeselInput`. Validation runs on change via the `validate` rule.',
      },
    },
  },
  render: function ReactHookFormStory() {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitSuccessful },
      watch,
    } = useForm({ defaultValues: { pesel: '' } })

    const peselValue = watch('pesel')

    function onSubmit(data: { pesel: string }) {
      console.log('Submitted:', data)
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: 320, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Controller
          name="pesel"
          control={control}
          rules={{
            required: 'PESEL is required',
            minLength: { value: 11, message: 'PESEL must be 11 digits' },
            validate: (v) => v.length < 11 || isValidPesel(v) || 'Invalid PESEL number',
          }}
          render={({ field }) => (
            <MantinePeselInput
              label="PESEL"
              placeholder="00000000000"
              value={field.value}
              onChange={(v) => field.onChange(v)}
              error={errors.pesel?.message}
            />
          )}
        />
        <SubmitButton />
        {isSubmitSuccessful && (
          <p style={{ color: '#16a34a', fontSize: '0.875rem', margin: 0 }}>
            Submitted: {peselValue}
          </p>
        )}
      </form>
    )
  },
}

export const TanstackForm: StoryObj = {
  name: 'TanStack Form',
  parameters: {
    docs: {
      description: {
        story: 'Use `form.Field` to connect `PeselInput` to TanStack Form. Errors from `validators.onChange` surface via `field.state.meta.errors`.',
      },
    },
  },
  render: function TanstackFormStory() {
    const [submitted, setSubmitted] = useState<string | null>(null)

    const form = useTanstackForm({
      defaultValues: { pesel: '' },
      onSubmit: async ({ value }) => setSubmitted(value.pesel),
    })

    return (
      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        style={{ width: 320, display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <form.Field
          name="pesel"
          validators={{
            onChange: ({ value }) => {
              if (value.length > 0 && value.length < 11) return 'PESEL must be 11 digits'
              if (value.length === 11 && !isValidPesel(value)) return 'Invalid PESEL number'
            },
          }}
        >
          {(field) => (
            <div className="pesel-input">
              <label className="pesel-input__label" htmlFor="pesel-tsf">PESEL</label>
              <PeselInput
                id="pesel-tsf"
                className="pesel-input__field"
                placeholder="00000000000"
                value={field.state.value}
                onChange={(v) => field.handleChange(v)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors.length > 0 && (
                <span className="pesel-input__error">{field.state.meta.errors[0]?.toString()}</span>
              )}
            </div>
          )}
        </form.Field>
        <SubmitButton />
        {submitted && (
          <p style={{ color: '#16a34a', fontSize: '0.875rem', margin: 0 }}>
            Submitted: {submitted}
          </p>
        )}
      </form>
    )
  },
}

export const HtmlForm: StoryObj = {
  name: 'HTML form',
  parameters: {
    docs: {
      description: {
        story:
          'Works with a plain HTML `<form>` — pass a `name` prop and read the value from `FormData` on submit. No form library required.',
      },
    },
  },
  render: function HtmlFormStory() {
    const [result, setResult] = useState<{ pesel: string; meta: PeselMeta } | null>(null)

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      const data = new FormData(e.currentTarget)
      const pesel = data.get('pesel') as string
      const m: PeselMeta = pesel.length === 11 && isValidPesel(pesel)
        ? { isValid: true }
        : { isValid: false }
      setResult({ pesel, meta: m })
    }

    return (
      <form onSubmit={handleSubmit} style={{ width: 320, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="pesel-input">
          <label className="pesel-input__label" htmlFor="pesel-html">PESEL</label>
          <PeselInput id="pesel-html" name="pesel" className="pesel-input__field" placeholder="00000000000" />
        </div>
        <SubmitButton />
        {result && (
          <p style={{ fontSize: '0.875rem', margin: 0, color: result.meta.isValid ? '#16a34a' : '#ef4444' }}>
            {result.meta.isValid ? `Valid PESEL: ${result.pesel}` : `Invalid PESEL: ${result.pesel}`}
          </p>
        )}
      </form>
    )
  },
}

function SubmitButton() {
  return (
    <button
      type="submit"
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        background: '#6366f1',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.875rem',
      }}
    >
      Submit
    </button>
  )
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Text, Stack, Group, Badge } from '@mantine/core'
import { Box, Chip } from '@mui/material'
import { Theme, TextField, Text as RadixText, Flex, Badge as RadixBadge } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { usePeselInput, type PeselMeta } from '../index'
import MantinePeselInput from '../mantine'
import MuiPeselInput from '../mui'

const meta: Meta = {
  title: 'Design Systems',
  parameters: {
    docs: {
      description: {
        component:
          'Ready-made adapters for popular design systems. Each adapter wraps `usePeselInput` and wires validation state into the host component\'s native error/helper API.',
      },
    },
  },
}

export default meta

export const Mantine: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          'Drop-in `TextInput` replacement from `react-pesel-input/mantine`. Error state is managed automatically; override with the `error` prop.',
      },
    },
  },
  render: function MantineStory() {
    const [peselMeta, setPeselMeta] = useState<PeselMeta>({ isValid: false })

    return (
      <Stack w={320} gap="xs">
        <MantinePeselInput
          label="PESEL"
          placeholder="00000000000"
          onChange={(_, m) => setPeselMeta(m)}
          description="Polish national identification number"
        />
        {peselMeta.isValid && (
          <Group gap="xs">
            <Badge color="teal" variant="light" size="sm">
              {peselMeta.gender === 'male' ? 'Male' : 'Female'}
            </Badge>
            <Text size="sm" c="dimmed">Born {peselMeta.dateOfBirth}</Text>
          </Group>
        )}
      </Stack>
    )
  },
}

export const MUI: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          'Drop-in `TextField` replacement from `react-pesel-input/mui`. Error and helper text are managed automatically; override with the `error` / `helperText` props.',
      },
    },
  },
  render: function MuiStory() {
    const [peselMeta, setPeselMeta] = useState<PeselMeta>({ isValid: false })

    function handleChange(_: string, m: PeselMeta) {
      setPeselMeta(m)
    }

    return (
      <Box display="flex" flexDirection="column" gap={1} width={320}>
        <MuiPeselInput
          label="PESEL"
          placeholder="00000000000"
          onChange={handleChange}
          helperText={peselMeta.isValid ? `Born ${peselMeta.dateOfBirth}` : 'Polish national identification number'}
          fullWidth
          variant="outlined"
        />
        {peselMeta.isValid && (
          <Chip
            label={peselMeta.gender === 'male' ? 'Male' : 'Female'}
            color="success"
            size="small"
            variant="outlined"
          />
        )}
      </Box>
    )
  },
}

export const RadixUI: StoryObj = {
  name: 'Radix UI',
  parameters: {
    docs: {
      description: {
        story:
          'Spread `inputProps` from `usePeselInput` onto `TextField.Root` from `@radix-ui/themes`. Radix handles focus rings and tokens; you control validation display.',
      },
    },
  },
  render: function RadixStory() {
    const { inputProps, meta, isComplete } = usePeselInput()

    return (
      <Theme>
        <Flex direction="column" gap="2" style={{ width: 320 }}>
          <RadixText as="label" size="2" weight="medium" htmlFor="pesel-radix">
            PESEL
          </RadixText>
          <TextField.Root
            id="pesel-radix"
            placeholder="00000000000"
            color={isComplete ? (meta.isValid ? 'green' : 'red') : undefined}
            {...inputProps}
          />
          {isComplete && meta.isValid && (
            <Flex align="center" gap="2">
              <RadixBadge color="green" variant="soft" radius="full">
                {meta.gender === 'male' ? 'Male' : 'Female'}
              </RadixBadge>
              <RadixText size="2" color="gray">Born {meta.dateOfBirth}</RadixText>
            </Flex>
          )}
          {isComplete && !meta.isValid && (
            <RadixText size="2" color="red">Invalid PESEL number</RadixText>
          )}
        </Flex>
      </Theme>
    )
  },
}

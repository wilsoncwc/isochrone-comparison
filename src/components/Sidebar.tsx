import React, { FC } from 'react'
import {
  Button, FormControl, FormLabel, Radio, RadioGroup, Select, Stack, StackDivider, useColorModeValue, VStack
} from '@chakra-ui/react'
import { ISO_APIS, modeSupported } from '../constants'
import { SidebarParams } from '../types'

interface SidebarProps {
  params: SidebarParams;
  setParams: (params: SidebarParams) => void;
  toggleIso?: () => void;
}

const Sidebar: FC<SidebarProps> = ({
  params,
  setParams,
  toggleIso
}) => {
  const apiOptions = Object.keys(ISO_APIS)
  const bg = useColorModeValue('gray.50', 'gray.900')
  const setAPIAndMode = (api: string) => {
    let mode = params.mode
    if (!modeSupported(api, mode)) {
      mode = ISO_APIS[api].modes[0]
    }
    setParams({ mode, api })
  }
  const setMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setParams({ ...params, mode: event.target.value })
  }

  return (
    <VStack
      divider={<StackDivider borderColor='gray.200' />}
      bg={bg}
      p={4}
      borderRadius={4}
      spacing={4}
    >
      <FormControl id="country">
        <FormLabel>
          Choose service
        </FormLabel>
        <RadioGroup defaultValue={params.api} onChange={setAPIAndMode}>
          <Stack spacing={4} direction="row">
            {apiOptions.map(api => (
              <Radio key={api} value={api}>
                {api}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
        <FormLabel mt={4}>
          Choose travel mode
        </FormLabel>
        <Select defaultValue={params.mode} onChange={setMode}>
          {ISO_APIS[params.api].modes.map(mode => (
            <option key={mode} value={mode.toString()}>
              {mode.charAt(0).toUpperCase() + mode.slice(1) /* Capitalize */}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={toggleIso} variant='outline' p='4'>
        Toggle Travel Time
      </Button>
    </VStack>
  )
}

export default Sidebar

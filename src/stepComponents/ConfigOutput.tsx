import { Button, Collapse, Stack, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { DSlider } from '../styles'
import { WizardContext, answers } from '../store'
import OptionsAndInput from '../OptionsAndInput'
import { expandedContext } from '../Wizard'

const ConfigOutput = ({onChange}: {onChange: (config: {videoLength: number, deliveryStyle: 'educational' | 'counsel' | 'story'}) => void}) => {
    const {outputConfig} = useContext(WizardContext)
    const {expanded, setExpanded} = useContext(expandedContext)
    
    return <Stack>
        <Button onClick={() => setExpanded(expanded === 'config output' ? undefined : 'config output')} >
            configure output
        </Button>
        <Collapse in={expanded === 'config output'} >
            <Stack direction='row' gap={3} flex={2} justifyContent='space-between' >
                <Stack flex={1} gap={1}>
                    <Typography> select video length </Typography>
                    <DSlider
                        value={outputConfig.videoLength}
                        min={30}
                        max={120}
                        step={30}
                        valueLabelDisplay='auto'
                        valueLabelFormat={(val, i) => val + ' seconds'}
                        marks={[{value: 30},{value: 60},{value: 90},{value: 120}]}
                        onChange={(e, val) => onChange({videoLength: val as number, deliveryStyle: outputConfig.deliveryStyle})}
                    />
                </Stack>

                <Stack flex={1} gap={1}>
                    <Typography variant='h4'>Select Delivery Style</Typography>
                    <OptionsAndInput 
                        options={answers.deliveryStyle}
                        withInput={false}
                        onChange={items => onChange({
                            videoLength: outputConfig.videoLength, 
                            deliveryStyle: items as string as 'educational' | 'counsel' | 'story'
                        })}
                    />
                </Stack>
            </Stack>
        </Collapse> 
    </Stack>
}


export default ConfigOutput
import { Collapse, ImageList, ImageListItem, Stack, Tooltip, Typography } from '@mui/material'
import { useContext, useEffect, useRef } from 'react'
import { DSlider, NavButton } from '../styles'
import { WizardContext, answers } from '../store'
import OptionsAndInput from '../OptionsAndInput'
import { expandedContext } from '../Wizard'
import useBackend from '../Backend'


type OutputConfig = {
    videoLength: number, 
    deliveryStyle: 'educational' | 'counsel' | 'story', 
    presenterId: string
}

const ConfigOutput = ({onChange}: {onChange: (config: OutputConfig) => void}) => {
    const {outputConfig} = useContext(WizardContext)
    const {expanded, setExpanded} = useContext(expandedContext)
    const backend = useBackend()

    const presenters = useRef<any[] | undefined>(undefined)

    useEffect(() => {
        if (!presenters.current) {
            backend.getPresenters().then(res => {
                presenters.current = res
            })
        }
    })
    
    return <Stack alignItems='center'>
        <NavButton onClick={() => setExpanded(expanded === 'config output' ? undefined : 'config output')} >
            (4) configure output
        </NavButton>
        <Collapse in={expanded === 'config output'} >
            <Stack direction='row' gap={3} flex={2} justifyContent='space-between' >
                <Stack flex={1} gap={1}>
                    <Typography> select presenter </Typography>
                    <ImageList>
                        {(presenters.current !== undefined) && presenters.current.map(p => {
                            

                            return <ImageListItem 
                                key={p.id}
                            >
                                <div onClick={() => {
                                    onChange({...outputConfig, presenterId: p.id})
                                }}>
                                    <Tooltip title={p.id}>
                                        <img src={p.thumbnail_url} />
                                    </Tooltip>
                                </div>
                            </ImageListItem>
                        })}
                    </ImageList>


                </Stack>
                <Stack flex={1} gap={1}>
                    <Typography> select video length </Typography>
                    <DSlider
                        value={outputConfig.videoLength}
                        min={30}
                        max={120}
                        step={30}
                        valueLabelDisplay='auto'
                        valueLabelFormat={val => val + ' seconds'}
                        marks={[{value: 30},{value: 60},{value: 90},{value: 120}]}
                        onChange={(_, val) => onChange({...outputConfig, videoLength: val as number,})}
                    />
                </Stack>

                <Stack flex={1} gap={1}>
                    <Typography variant='h4'>Select Delivery Style</Typography>
                    <OptionsAndInput 
                        options={answers.deliveryStyle}
                        withInput={false}
                        onChange={items => onChange({
                            ...outputConfig,
                            deliveryStyle: items as string as 'educational' | 'counsel' | 'story'
                        })}
                    />
                </Stack>
            </Stack>
        </Collapse> 
    </Stack>
}


export default ConfigOutput
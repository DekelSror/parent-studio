import { ButtonGroup, Button, Input, FormControl, Select, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { SelectInput, SelectItem, SelectedButton, UnselectedButton, colors } from './styles'

type OptionsAndInputProps = {
    options: string[], 
    multiple?: boolean, 
    withInput: boolean
    onChange: (items: string | string[]) => void
    addLabel?: string
}

const OptionsAndInput = ({options, multiple, withInput, onChange, addLabel}: OptionsAndInputProps) => {
    const [selected, setSelected] = useState<string[]>([])
    const [written, setWritten] = useState<string[]>([])
    const [edited, setEdited] = useState('')
    const [inputFocused, setInputFocused] = useState(false)

    const handleChange = (val: string[]) => {
        console.log(val, selected)
        setSelected(val)
        onChange(multiple ? val : (val.length > 0 ? val[0] : val))
    }

    return <Stack>
        <ButtonGroup style={{display: 'flex', flexDirection: 'row', gap: 10, padding: 2}}>
            {options.map(opt => {
                return selected.includes(opt) ? <SelectedButton
                    key={opt}
                    onClick={() => {
                        let after = selected.slice()
                        after.splice(selected.indexOf(opt))
                        handleChange(after)
                }}>
                    <Typography variant='subtitle2' > {opt} </Typography>
                </SelectedButton> : <UnselectedButton
                    key={opt}
                    onClick={() => {
                        if (multiple) {
                            handleChange([...selected, opt])
                        }
                        else {
                            handleChange([opt])
                        }
                    }}
                >
                    <Typography variant='subtitle2' > {opt} </Typography>
                </UnselectedButton>
            })}
        </ButtonGroup>

        {withInput && <Stack p={3}  style={{border: '3px solid pink'}}>
            {multiple && (written.length > 0) && <FormControl>
                <Select
                    input={<SelectInput />}
                    multiple={multiple}
                    value={written}
                    onChange={e => {
                        const val = e.target.value as string[]

                        if (!multiple) {
                            setWritten([val[0]])
                        } else {
                            setWritten(val)
                        }
                    }}
                >
                    {written.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </Select>
            </FormControl>}
            {!multiple && (written.length > 0) && <Button variant='text' onClick={() => setWritten([])}> {written[0]} </Button>}

            <FormControl>
                <Stack alignItems='start' borderRadius={3} width='fit-content' p={'1rem 6rem 1rem 6rem'} style={{backgroundColor: colors.white + 'cc'}}>
                    <Input onFocus={() => {
                        setInputFocused(true)
                    }} 
                    
                    type='text' value={edited} onChange={e => setEdited(e.target.value)} />
                    <Button onClick={() => {
                        if (edited !== '') {
                            setWritten([...written, edited])
                            setEdited('')
                            setInputFocused(false)
                        }
                    }}>
                        <Typography color={inputFocused ? colors.darkerBlue : colors.black}>
                            {addLabel || 'add free text item '}
                        </Typography>
                    </Button>
                </Stack>
            </FormControl>
        </Stack>}
    </Stack>
}

export default OptionsAndInput
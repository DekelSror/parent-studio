import { ButtonGroup, Button, FormControl, Select, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { AddButton, DInput, SelectInput, SelectItem, SelectLabel, SelectedButton, UnselectedButton } from './styles'

type OptionsAndInputProps = {
    options: string[], 
    multiple?: boolean, 
    withInput: boolean
    onChange: (items: string | string[]) => void
    addLabel?: string
}

const OptionsAndInput = ({options, multiple, withInput, onChange, addLabel}: OptionsAndInputProps) => {
    const [selected, setSelected] = useState<string[]>([])
    const [custom, setCustom] = useState<string[]>([])
    const [edited, setEdited] = useState('')

    const handleChange = (val: string[]) => {
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

        {withInput && <Stack p={3} >
            {multiple && (custom.length > 0) && <FormControl>
                <Select
                    input={<SelectInput />}
                    multiple
                    value={custom}
                    onChange={e => {
                        const val = e.target.value as string[]

                        if (!multiple) {
                            setCustom([val[0]])
                        } else {
                            setCustom(val)
                        }
                    }}
                >
                    {custom.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </Select>
            </FormControl>}
            {!multiple && (custom.length > 0) && <Button variant='text' onClick={() => setCustom([])}> {custom[0]} </Button>}

            <FormControl sx={{gap: 3}}>
                <SelectLabel> {addLabel || 'add free text item '}</SelectLabel>
                <DInput 
                    sx={{maxWidth: '50%'}} 
                    type='text' 
                    value={edited} 
                    onChange={e => setEdited(e.target.value)} 
                />
                <AddButton onClick={() => {
                    if (edited !== '') {
                        if (multiple) {
                            setCustom([...custom, edited])
                        }
                        else {
                            setCustom([edited])
                        }

                        setEdited('')
                    }
                }}>
                    ADD
                </AddButton>
            </FormControl>
        </Stack>}
    </Stack>
}

export default OptionsAndInput
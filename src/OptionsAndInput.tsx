import { ButtonGroup, Button, Input, FormControl, Select, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { ButtonGroupButton, SelectInput, SelectItem, colors } from './styles'


type OptionsAndInputProps = {
    options: string[], 
    multiple?: boolean, 
    withInput: boolean
    onChange: (items: string | string[]) => void
    itemComponent?: (item: string) => JSX.Element
    addLabel?: string
}

const OptionsAndInput = ({options, multiple, withInput, onChange, itemComponent, addLabel}: OptionsAndInputProps) => {
    const [selected, setSeleted] = useState<string[]>([])
    const [written, setWritten] = useState<string[]>([])
    const [edited, setEdited] = useState('')

    useEffect(() => {
        const val = selected.concat(written)
        onChange(multiple ? val : val[0])
    }, [selected, written, multiple, onChange])

    return <Stack>
        <ButtonGroup style={{display: 'flex', flexDirection: 'row', gap: 10, flex: 4, padding: 2}} >
            {options.map((opt, i) => {
                return <ButtonGroupButton
                    style={{backgroundColor: selected.includes(opt) ? colors.green : 'inherit'}}
                    key={opt}
                    onClick={() => {
                        if (selected.includes(opt)) {
                            let after = selected.slice()
                            after.splice(i)
                            setSeleted(after)
                        }
                        else {
                            if (multiple) {
                                setSeleted([...selected, opt])
                            }
                            else {
                                setSeleted([opt])
                            }
                        }
                    }}
                >
                    {itemComponent && itemComponent(opt)}
                    {!itemComponent && <Typography>{opt}</Typography>}
                </ButtonGroupButton>
            })}
        </ButtonGroup>

        {withInput && <>
            {multiple && (written.length > 0) && <FormControl>
                <Select
                    input={<SelectInput />}
                    multiple={multiple}
                    value={written}
                    onChange={e => {
                        const val = e.target.value as string[]

                        // console.log(e.target.value)

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
            {!multiple && (written.length > 0) && <Typography> {written[0]} </Typography>}

            <Input style={{width: '45%', height: 50}} type='text' value={edited} onChange={e => setEdited(e.target.value)} />
            <Button onClick={() => {
                if (edited !== '') {
                    setWritten([...written, edited])
                    setEdited('')
                }
            }} > 
                {addLabel || 'add free text item '}
            </Button>
        </>}
    </Stack>
}




export default OptionsAndInput
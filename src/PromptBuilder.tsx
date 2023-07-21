import { useContext, useEffect, useRef, useState } from 'react'
import { WizardContext, stateDict } from './store'
import { Button, ButtonGroup, FormControl, IconButton, Input, InputLabel, Stack, Typography } from '@mui/material'
import { RemoveCircleOutline } from '@mui/icons-material'
import { AddButton } from './styles'
import useBackend from './Backend'


type PromptTerm = {
    termType: 'free text' | 'key',
    value: string
}

// const writePropmt = (seq: PromptTerm[], w2d: {[k: string]: string}) => {
//     return seq.reduce((prompt, term) => {
//         if (term.termType === 'free text') return prompt + ' ' + term.value
//         return prompt + ' ' + w2d[term.value]
//     }, '')
// }

const PromptBuilder = () => {
    const wizardState = useContext(WizardContext)
    const [seq, setSeq] = useState<PromptTerm[]>([])
    const backend = useBackend()
    const prompts = useRef<{version: string, seq: PromptTerm[]}[]>([])
    const version = useRef(0)

    const w2d = stateDict(wizardState)

    const [freetext, setFreetext] = useState('')

    useEffect(() => {
        backend.getPrompts().then(res => {
            prompts.current = res.map(item => JSON.parse(item) as {version: string, seq: PromptTerm[]})
            version.current = res.length
        })
    }, [])

    return <>
        <Typography variant='h4'> Prompt Builder </Typography>
        <div 
            style={{minHeight: 50, border: '1px solid black', display: 'flex', flexWrap: 'wrap', flexGrow: 1, flexShrink: 100}} 
            onDrop={e => {
                const data: PromptTerm = JSON.parse(e.dataTransfer.getData('application/json'))
                setSeq([...seq, data])
                e.preventDefault()
            }}
            onDragEnter={e => e.preventDefault()}
            onDragOver={e => e.preventDefault()}
        >
            {seq.length === 0 && <Typography> add written parts or drag answers here to create your prompt </Typography>}
            {seq.length > 0 && seq.map((term, i) => {
                return <Stack key={term.value} alignItems='center' flexDirection='row' p={1} gap={1} justifyContent='space-around'>
                    <Typography> {term.termType === 'key' ? w2d[term.value] : term.value} </Typography>
                    <IconButton 
                        // also make draggable - to change the sequence
                        style={{padding: 0}}
                        onClick={() => {
                            let after = seq.slice()
                            after.splice(i)
                            setSeq(after)
                        }}
                    > 
                        <RemoveCircleOutline /> 
                    </IconButton> 
                </Stack>
            })}
        </div>

        <ButtonGroup>
            {Object.keys(w2d).map(k => <Button
                draggable
                key={k}
                onDragStart={e => {
                    e.dataTransfer.effectAllowed = 'copy'
                    e.dataTransfer.setData('application/json', JSON.stringify({termType: 'key', value: k}))
                }}
            >
                {k}
            </Button>)}
        </ButtonGroup>

        <FormControl>
            <InputLabel > add text </InputLabel>
            <Input 
                type='text' 
                value={freetext} 
                onChange={e => setFreetext(e.target.value)}  
            />
            <Button onClick={() => {
                if (freetext.length > 0) {
                    setSeq([...seq, {termType: 'free text', value: freetext}])
                    setFreetext('')
                }
            }} >
                +
            </Button>
        </FormControl>
        
        <Stack>
            {prompts.current.map(prompt => <Stack key={prompt.version}> 
                {prompt.version}
                <Button > load prompt to editor </Button>
            </Stack>)}
        </Stack>

        <AddButton onClick={() => {
            backend.savePrompt(JSON.stringify({version: version, seq: seq}))
        }} > 
            save prompt 
        </AddButton>
    </>
}

export default PromptBuilder
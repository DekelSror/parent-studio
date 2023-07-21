import { Checkbox, Collapse, FormControl, Stack, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { FamilyContext, WizardContext, answers } from '../store'
import { AddButton, DInput, DSlider, DSwitch, SelectLabel } from '../styles'
import { globz } from '../globalize'
import OptionsAndInput from '../OptionsAndInput'
import { expandedContext } from '../Wizard'


const ContextQuestions = ({onSubmit}: {onSubmit: (ctx: FamilyContext) => void}) => {
    const {context} = useContext(WizardContext)
    const {expanded, setExpanded} = useContext(expandedContext)

    const [siblingAge, setSiblingAge] = useState(0)
    const [childAtSchool, setChildAtSchool] = useState(Boolean(context.gradeAtSchool))


    return <Stack gap={3} p={2} >
        <Typography variant='h5' > 2. Context </Typography>
        <Stack gap={2} p={2} maxWidth='60%'>
        <FormControl>
                <SelectLabel > child's name </SelectLabel>
                <DInput />
        </FormControl>
        <FormControl>
                <SelectLabel > nickname </SelectLabel>
                <DInput />
        </FormControl>
        </Stack>

        <Stack direction='row'>
            <Typography variant='subtitle2' > {globz('context.targetChildAge')} ({context.targetChildAge}) </Typography>
            <DSlider 
                sx={{width: 200}}
                min={3}
                max={12}
                step={1}
                valueLabelDisplay='auto'
                value={context.targetChildAge}
                onChange={(_, val) => onSubmit({...context, targetChildAge: (val as number)})}
            />
        </Stack>

        <Stack>
            <SelectLabel id='favorite activities'> {globz('context.favoriteActivities')} </SelectLabel>
            <OptionsAndInput 
                options={answers.favoriteActivities}
                multiple
                withInput
                onChange={favs => onSubmit({...context, favoriteActivities: favs as string[]})}
                addLabel='add favorite activity'
            />
        </Stack>

        {expanded !== 'context' && <AddButton onClick={() => setExpanded(expanded === 'context' ? undefined : 'context')} >
            {expanded === 'context' ? 'close' : 'more context ... '}
        </AddButton>}

        <Collapse in={expanded === 'context'} >
            <Stack direction='column' >
                <Typography variant='subtitle2' > {globz('context.siblings')} ({context.siblings.join(',')}) </Typography>
                <DSlider 
                    min={0}
                    max={40}
                    step={1}
                    value={siblingAge}
                    valueLabelDisplay='auto'
                    onChange={(_, val) => setSiblingAge(val as number)}
                />
                <AddButton 
                    style={{alignSelf: 'center'}}
                    variant='outlined'
                    onClick={() => {
                        onSubmit({...context, siblings: [...context.siblings, siblingAge]})
                        setSiblingAge(0)
                    }} 
                > 
                    Add sibling 
                </AddButton>
            </Stack>

            <Stack direction='row' justifyContent='space-around' alignItems='start' marginBottom={4}>
                    <Typography variant='subtitle1' > {globz('context.siblingsLivingTogether')} </Typography>
                    <form>
                        <DSwitch value={context.liveTogether} onChange={(_, val) => onSubmit({...context, liveTogether: val})} />
                    </form>
            </Stack>

            <form>
                <Stack direction='row' alignItems='center' paddingBottom={4} >
                    <Typography variant='body2' > {globz('context.schoolAge')} </Typography>
                    <Checkbox color='success' checked={childAtSchool} onChange={(_, checked) => setChildAtSchool(checked)} />

                    <Typography variant='body2' > {globz('context.gradeAtSchool')} </Typography>
                    <DSlider
                        min={1}
                        max={12}
                        step={1}
                        valueLabelDisplay='auto'
                        value={context.gradeAtSchool || 1}
                        onChange={(_, val) => onSubmit({...context, gradeAtSchool: val as number})}
                        disabled={!childAtSchool}
                    />
                </Stack>
            </form>
            <AddButton onClick={() => setExpanded(undefined)} > less ... </AddButton>
        </Collapse>

    </Stack>
}

export default ContextQuestions
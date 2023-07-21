import { Collapse, Stack } from '@mui/material'
import { useContext } from 'react'
import OptionsAndInput from '../OptionsAndInput'
import { answers } from '../store'
import { expandedContext } from '../Wizard'
import { NavButton } from '../styles'


const EducationalMethods = ({onSubmit}: {onSubmit: (methods: string[]) => void}) => {
    const {expanded, setExpanded} = useContext(expandedContext)

    return <Stack alignItems='center'>
        <NavButton onClick={() => setExpanded(expanded === 'methods' ? undefined : 'methods')}>
            (3) select educational method
        </NavButton>
        <Collapse in={expanded === 'methods'} >
            <OptionsAndInput 
                options={answers.educationalMethods}
                multiple
                withInput={false}
                onChange={items => onSubmit(items as string[])}
            />
    </Collapse>
    </Stack>
}

export default EducationalMethods
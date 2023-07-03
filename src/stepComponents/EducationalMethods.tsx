import { Button, Collapse, Stack } from '@mui/material'
import { useContext } from 'react'
import OptionsAndInput from '../OptionsAndInput'
import { answers } from '../store'
import { expandedContext } from '../Wizard'


const EducationalMethods = ({onSubmit}: {onSubmit: (methods: string[]) => void}) => {
    const {expanded, setExpanded} = useContext(expandedContext)

    return <Stack>
        <Button onClick={() => setExpanded(expanded === 'methods' ? undefined : 'methods')}>
            select educational method
        </Button>
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
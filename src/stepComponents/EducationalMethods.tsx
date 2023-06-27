import { Button, Collapse, Stack, Tooltip, Typography } from '@mui/material'
import { useContext } from 'react'
import OptionsAndInput from '../OptionsAndInput'
import { answers } from '../store'
import { expandedContext } from '../Wizard'

const methodsData: {[k:string]: string} = {
    'Montessori': "a method that emphasizes independence, freedom with limits, and respect for the child's natural development1.",
    'Waldorf': "a method that emphasizes the development of the child's imagination and creativity1.",
    'Reggio Emilia': "a method that emphasizes the importance of the physical and social environment in the child's learning1.",
    'Constructivism': "a method that emphasizes the construction of knowledge by the child2.",
    'Traditional': "a method that emphasizes the transmission of knowledge by teachers2.",
}

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
                itemComponent={item => <Tooltip title={methodsData[item]}>
                    <Typography> {item} </Typography>    
                </Tooltip>}
            />
    </Collapse>
    </Stack>
}

export default EducationalMethods
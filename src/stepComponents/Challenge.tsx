import { answers } from '../store'
import { Stack, Typography } from '@mui/material'
import { globz } from '../globalize'
import OptionsAndInput from '../OptionsAndInput'
import { colors } from '../styles'


const Challenge = ({onChange}: {onChange: (challenge: string) => void}) => {
    return <Stack gap={4} justifyContent='center' p={2} style={{backgroundColor: colors.green + '77'}} >
        <Typography variant='h5'> 1. The Challenge </Typography>
        <Typography variant='subtitle2'> {globz('challenge.description')} </Typography>
        <OptionsAndInput
            options={answers.challenge}
            onChange={items => onChange(items as string)}
            withInput
            addLabel='custom challenge'
        />
        
    </Stack>
}

export default Challenge
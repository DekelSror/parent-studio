import { answers } from '../store'
import { Stack, Typography } from '@mui/material'
import { globz } from '../globalize'
import OptionsAndInput from '../OptionsAndInput'


const Challenge = ({onChange}: {onChange: (challenge: string) => void}) => {
    return <Stack gap={4} justifyContent='center' p={2}>
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
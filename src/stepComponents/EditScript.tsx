import { Stack , Button, Typography} from '@mui/material'
import { WizardContext } from '../store'
import useBackend from '../Backend'
import { useAuth0 } from '@auth0/auth0-react'
import { useContext } from 'react'

const EditScript = ({onChange, active}: {onChange: (script: string) => void, active: boolean}) => {
    const {prompt, script} = useContext(WizardContext)
    const backend = useBackend()
    const {user} = useAuth0()

    return <Stack>
            {active && <Typography>{script}</Typography>}
        {!active &&
            <Stack flex={2} direction='row' gap={2} >
                <Stack sx={{flex: 1}} gap={1}>
                    <Typography variant='h4' > Prompt </Typography>
                    <Typography style={{width: 300}}>{prompt}</Typography>
                </Stack>
                <Stack sx={{flex: 1}} gap={1}>
                    <Typography variant='h4' > Script </Typography>
                    <form>
                        <textarea style={{width: 300}} value={script} contentEditable onChange={e => onChange(e.target.value)} />
                    </form>
                </Stack>
            </Stack>
        }
        {user && <Button onClick={() => backend.savePrompt(prompt, user.email!)} > save prompt </Button>}
    </Stack>
}

export default EditScript
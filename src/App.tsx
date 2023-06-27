import { AppBar, Box, Button, CssBaseline, Stack, ThemeProvider, Toolbar, Typography } from '@mui/material'
import React, { createContext, useState } from 'react'
import { AppContainer, StepContainer, theme, colors, AddButton, SelectInput } from './styles'
import Wizard from './Wizard'

export type User = {
    email: string
    role: 'editor' | 'user' | 'guest'
    // creds?: CredentialResponse
}

export const userContext = createContext<User>({email: 'guest@cactus.br', role: 'guest'})

const superUsers: User[] = [
    {email: 'guest@cactus.br', role: 'guest'},
    {email: 'srordekel@gmail.com', role: 'editor'},
    {email: 'abe@maisautonomia.com.br', role: 'editor'}
]

const App = () => {
    const [user, setUser] = useState<User>({email: 'guest@cactus.br', role: 'guest'})
    const [where, setWhere] = useState('home')

    return <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContainer gap={2} sx={{justifyContent: 'start' }}>

        <AppBar sx={{backgroundColor: colors.purple}} >
            <Toolbar>
                <Button variant='contained' > LOGO or Something </Button>
                <Box width='100%' />
                <Button variant='text'> <Typography color={colors.white} variant='body1'> alguma coisa </Typography> </Button>
                <Button variant='text'> <Typography color={colors.white} variant='body1'> about us </Typography> </Button>
                <Button variant='text'> <Typography color={colors.white} variant='body1'> {where} </Typography> </Button>
            </Toolbar>
        </AppBar>

        {where === 'home' && <StepContainer gap={3} >
            <Typography variant='h4' textAlign='center' > WELCOME blah blah blah </Typography>
            <form style={{display: 'flex', gap: '1.2rem', justifyContent: 'center'}} onSubmit={e => {
                const u = superUsers.find(su => su.email === user.email)

                if (u) {
                    setUser({...user, role: u.role})
                    setWhere('wizard')
                }

            }}>
                <SelectInput 
                    placeholder='enter your e-mail to start creating immediately'
                    value={user.email || ''}
                    type='email' 
                    error={(user.email!== undefined) && (user.email !== '')}
                    onChange={e => {
                        setUser({...user, email: e.target.value})
                    }}
                />
                <AddButton type='submit' > Start now! </AddButton>
            </form>
            {/* <GoogleLogin 
                onSuccess={creds => setUser({...user, creds: creds})}
                onError={alert}
            /> */}
        </StepContainer>}


        {where === 'wizard' && <userContext.Provider value={user}>
            <Wizard onSubmit={stt => {}} onExit={() => setWhere('home')} />
        </userContext.Provider>}

        <Stack direction='row' gap={4}>
            <Typography variant='body2'> footer </Typography>
            <Typography variant='body2'> twitter  </Typography>
            <Typography variant='body2'> etc </Typography>
        </Stack>

        </AppContainer>
    </ThemeProvider>
}

export default App
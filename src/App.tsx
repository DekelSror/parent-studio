import { AppBar, Box, Button, CssBaseline, Stack, ThemeProvider, Toolbar, Typography } from '@mui/material'
import { createContext, useEffect, useState } from 'react'
import { AppContainer, StepContainer, theme, colors, NavButton } from './styles'
import Wizard from './Wizard'
import { useAuth0 } from '@auth0/auth0-react'
import { UserData, getUserData } from './users'


export const UserDataContext = createContext<UserData | undefined>(undefined)

const App = () => {
    const auth = useAuth0()
    const [userData, setUserData] = useState<UserData>()
    
    
    const [where, setWhere] = useState('home')

    useEffect(() => {
        if (auth.user !== undefined) {
            if (auth.user.email !== undefined) {
                setWhere('wizard')
                getUserData(auth.user.email).then(udata => {
                    if (udata) {
                        setUserData(udata)
                        // if (where === 'home') setWhere('wizard')
                    }
                    else {
                        // first time??
                    }
                })
            } else {
                setUserData(undefined)
            }
        }
    }, [auth.user])

    if (auth.isLoading) return <>loading auth</>

    return <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContainer gap={2} sx={{justifyContent: 'start' }}>

        <AppBar sx={{backgroundColor: colors.purple}} >
            <Toolbar>
                {auth.user && <Button onClick={() => auth.logout()} >logout</Button>}
                <Button variant='contained' > LOGO or Something </Button>
                <Box width='100%' />
                {!auth.isAuthenticated && <Button onClick={() => auth.loginWithRedirect()} > LOGIN </Button>}
            </Toolbar>
        </AppBar>



        {where === 'home' && <StepContainer gap={3} >
            <Typography variant='h4' textAlign='center' > WELCOME blah blah blah </Typography>
            {!auth.isAuthenticated && <NavButton onClick={() => auth.loginWithRedirect()} > LOGIN </NavButton>}
            {auth.isAuthenticated && userData && <NavButton onClick={() => setWhere('wizard')} > go to wizard </NavButton>}
            {userData?.tier === 'editor' && <> add / remove users </>}
        </StepContainer>}

        <UserDataContext.Provider value={userData}>
            {(userData !== undefined) && (where === 'wizard') && <Wizard onSubmit={stt => {console.log(stt)}} onExit={() => setWhere('home')} />}
        </UserDataContext.Provider>

        <Stack direction='row' gap={4}>
            <Typography variant='body2'> footer </Typography>
            <Typography variant='body2'> twitter  </Typography>
            <Typography variant='body2'> etc </Typography>
        </Stack>

        </AppContainer>
    </ThemeProvider>
}

export default App
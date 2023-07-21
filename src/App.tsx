import { AppBar, Box, Button, CssBaseline, Stack, ThemeProvider, Toolbar, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { AppContainer, StepContainer, theme, colors, NavButton, AddButton } from './styles'
import Wizard from './Wizard'
import { useAuth0 } from '@auth0/auth0-react'
import { UserDataContext, canAccess } from './users'


const App = () => {
    const auth = useAuth0()        
    const [where, setWhere] = useState('home')
    const userData = useContext(UserDataContext)
    
    if (auth.isLoading) return <>loading auth</>

    return <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContainer id='my-app-container' gap={2} >

        <AppBar sx={{backgroundColor: colors.purple +  'ee'}} >
            <Toolbar>
                <Button variant='contained' onClick={() => {
                    setWhere('home')
                    window.scrollTo(0, 0)
                }} >
                    LOGO or Something
                </Button>
                <Box width='100%' />
                {!auth.isAuthenticated && <AddButton onClick={() => auth.loginWithRedirect()} > LOGIN </AddButton>}
                {auth.user && <NavButton onClick={() => auth.logout({openUrl: window.location.replace})} >logout</NavButton>}
            </Toolbar>
        </AppBar>

        {where === 'home' && <Stack width='100%' alignItems='center'>
            <StepContainer style={{maxWidth: '75%'}} gap={3} mb={4} alignItems='center' >
                <div style={{backgroundColor: colors.darkGrey, padding: 5, borderRadius: 10}}>
                    <Typography variant='h4' color={colors.white} textAlign='center' > WELCOME blah blah blah </Typography>
                </div>
                {!auth.isAuthenticated && <AddButton onClick={() => auth.loginWithRedirect()} > LOGIN </AddButton>}
                {canAccess('wizard:view', userData) && <AddButton onClick={() => setWhere('wizard')} > go to wizard </AddButton>}
                {/* <Button onClick={() => {
                    getUserData('abe@maisautonomia.com.br').then(u => {
                        console.log(u, u?.email)
                        if (u) {
                            setUserData({...u, tier: 'regular'})
                        }
                    })
                }} > 
                    set user 
                </Button> */}
                {userData.tier !== 'guest' && <Stack>
                    <Typography>your videos</Typography>
                    {userData.videos.map(v => <Typography key={v}>{v}</Typography>)}
                </Stack>}
            </StepContainer>

            <StepContainer style={{maxWidth: '75%'}} gap={3}mb={4} >
                <Typography variant='subtitle1'> Help children understand morals and ideas, and have them confront challenges in a secure, individually crafted environment </Typography>
                <Typography variant='subtitle1'> Quick - we have ready-made answers to get your content ready A$AP </Typography>
                <Typography variant='subtitle1'> You have the control - insert free text answers as well </Typography>
                <Typography variant='subtitle1'> Tweak the educational method and delivery style of the video </Typography>
                <Typography variant='subtitle1'> maybe a graphic of the wizard process </Typography>
                <NavButton> Do something </NavButton>
            </StepContainer>

            <StepContainer style={{maxWidth: '75%'}} gap={3} mb={4} >
                <Typography variant='subtitle1'> Gallery of testaments of the quality of our stuff </Typography>
                <Typography variant='subtitle1'> some other details that may or may not matter </Typography>
                <NavButton> Do something else! </NavButton>
            </StepContainer>
        </Stack>}

        {where === 'wizard' && <Wizard onSubmit={stt => {console.log(stt)}} onExit={() => setWhere('home')} />}

        <AppBar position='sticky' color='transparent' style={{backgroundColor: colors.white}}>
            <Toolbar style={{display: 'flex', justifyContent: 'space-around'}}>
                <Typography variant='body2'> footer </Typography>
                <Typography variant='body2'> twitter  </Typography>
                <Typography variant='body2'> etc </Typography>
            </Toolbar>
        </AppBar>
        </AppContainer>
    </ThemeProvider>
}

export default App
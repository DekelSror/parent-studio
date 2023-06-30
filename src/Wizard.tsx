import { createContext, useContext, useRef, useState } from 'react'
import { NavButton, StepContainer } from './styles'
import { Backdrop, Button, Stack, Typography, styled } from '@mui/material'
import Challenge from './stepComponents/Challenge'
import ConfigAvatar from './stepComponents/ConfigAvatar'
import ConfigOutput from './stepComponents/ConfigOutput'
import ContextQuestions from './stepComponents/ContextQuestions'
import EditScript from './stepComponents/EditScript'
import EducationalMethods from './stepComponents/EducationalMethods'
import Finalize from './stepComponents/Finalize'
import { WizardState, WizardContext, testState } from './store'
import useBackend from './Backend'
import PromptBuilder from './PromptBuilder'
import { useAuth0 } from '@auth0/auth0-react'
import { UserDataContext } from './App'
import { setUserData } from './users'

enum AppStep {context, output, review, finalize}

export const expandedContext = createContext<{expanded: string | undefined, setExpanded: (val: string | undefined) => void}>(
    {expanded: undefined, setExpanded: _ => {}}
)

const DBackdrop = styled(Backdrop)(() => ({
    backdropFilter: 'blur(3px)',
}))

const Wizard = ({onSubmit, onExit}: {onSubmit: (stt: WizardState) => void, onExit: () => void}) => {
    const [state, setState] = useState<WizardState>(testState())
    const backend = useBackend()
    const [expanded, setExpanded] = useState<string>()
    const [currentStep, setCurrentStep] = useState(AppStep.context)
    const {user} = useAuth0()
    const userData = useContext(UserDataContext)
    const isStreaming = useRef(false)
    

    // should be part of some store...
    const [videoId, setVideoId] = useState<string>()

    const progressInterval = useRef<NodeJS.Timer>()

    const generateScript = () => {
        isStreaming.current = true

        backend.streamScript(state, delta => {
                    
            const lastFinishReason = delta[delta.length - 1].choices[0].finish_reason
            const lastContent = delta[delta.length - 1].choices[0].delta.content
            if (lastFinishReason === 'stop' || (!lastContent)) {
                state.prompt = backend.scriptPrompt(state)
                isStreaming.current = false

            }
            
            const parsed = delta.reduce((s, d) => {
                if (d.choices[0].delta.content) {
                    s += d.choices[0].delta.content
                }

                return s
            }, '')
            
            
            state.script = parsed
            setState({...state, script: parsed})
        })
    }

    const generateVideo = async() => {
        const videoIdNew = await backend.generateVideo(state)
        
        if (videoIdNew) {
            setVideoId(videoIdNew) // set user data with new videoId
            setUserData({...userData!, videos: [...userData!.videos, videoIdNew]})
            
            progressInterval.current = setInterval(async() => {
                    
                const statusOrUrl = await backend.videoProgress(videoId!)
                
                if (statusOrUrl.startsWith('http')) {
                    setState({...state, outputUrl: statusOrUrl})
                    clearInterval(progressInterval.current)
                    onSubmit(state)
                }
            }, 3000)
        }
    }

    const testSetUser = async() => {
        const res = await fetch(import.meta.env.VITE_KV_REST_API_URL + '/set/abe@maisautonomia.com.br', {
            method: 'post',
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_KV_REST_API_TOKEN
            },
            body: JSON.stringify({
                tier: 'editor',
                videos: [],
                savedAnswers: testState()
            })
        })

        const j = await res.json()

        console.log(j)
    }

    console.log('wizard', AppStep[currentStep])
            
    return <WizardContext.Provider value={state}>
        <expandedContext.Provider value={{expanded: expanded, setExpanded: setExpanded}}>
        <Typography> hello, {user?.given_name} | {user?.locale} </Typography>
        
        <Button onClick={testSetUser} > TEST SET USER </Button>

        <StepContainer gap={2}>
            <Typography variant='h3' > Context </Typography>
            <Challenge onChange={challenge => setState({...state, challenge: challenge})} />
            <ContextQuestions onSubmit={ctx => setState({...state, context: ctx})} />
            <EducationalMethods onSubmit={methods => setState({...state, educationalMethods: methods})} />
            <ConfigOutput onChange={config => setState({...state, outputConfig: config})} />
            {userData?.tier === 'editor' && <PromptBuilder />}
            <NavButton disabled={currentStep !== AppStep.context} onClick={() => setCurrentStep(AppStep.review)} > Generate Script </NavButton>
        </StepContainer>
        </expandedContext.Provider>

        <DBackdrop open={currentStep === AppStep.review} sx={{zIndex: 3}} >
            <StepContainer p={2} gap={3} height={400} overflow='scroll'>

                <Typography variant='subtitle2'>please review your stuff</Typography>
                <Typography variant='subtitle1' style={{maxHeight: 270, whiteSpace: 'break-spaces', overflowY: 'scroll'}}> 
                    {JSON.stringify(state, null, 4)}
                </Typography>
                <NavButton
                    disabled={(currentStep !== AppStep.review) || (userData?.tier === 'guest')} 
                    onClick={() => {
                        setCurrentStep(AppStep.output)
                        generateScript()
                    }} 
                > 
                    {userData?.tier === 'guest' ? 'Please register with us to start generating' : 'Go!'}
                </NavButton>
            </StepContainer>
        </DBackdrop>

        {currentStep === AppStep.output && <StepContainer >
            <EditScript onChange={script => setState({...state, script: script})} active={isStreaming.current} />
            <ConfigAvatar />
            <NavButton disabled={user === undefined} onClick={() => {
                generateVideo()
                setCurrentStep(AppStep.finalize)
            }} >
                Generate Video
            </NavButton>
        </StepContainer>}

        {currentStep === AppStep.finalize && <StepContainer>
            <EditScript onChange={_ => {}} active={false} />
            <Finalize />
        </StepContainer>}

        <Stack direction='row' gap={4} justifyContent='space-around' >
            <NavButton onClick={onExit} > exit </NavButton>
            <NavButton onClick={() => setCurrentStep(AppStep.context)} > restart </NavButton>
        </Stack>

    </WizardContext.Provider>
}

export default Wizard
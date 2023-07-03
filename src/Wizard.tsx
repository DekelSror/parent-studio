import { createContext, useContext, useRef, useState } from 'react'
import { AddButton, NavButton, StepContainer, colors } from './styles'
import { Backdrop, Stack, Typography, styled } from '@mui/material'
import Challenge from './stepComponents/Challenge'
import ConfigAvatar from './stepComponents/ConfigAvatar'
import ConfigOutput from './stepComponents/ConfigOutput'
import ContextQuestions from './stepComponents/ContextQuestions'
import EditScript from './stepComponents/EditScript'
import EducationalMethods from './stepComponents/EducationalMethods'
import Finalize from './stepComponents/Finalize'
import { WizardState, WizardContext, emptyState, stateDict } from './store'
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
    const {user} = useAuth0()
    const userData = useContext(UserDataContext)
    const backend = useBackend()

    const [state, setState] = useState<WizardState>(userData?.savedAnswers || emptyState())
    const [currentStep, setCurrentStep] = useState(AppStep.context)
    
    const [expanded, setExpanded] = useState<string>()
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

    // console.log('wizard', userData?.tier)
    const w2d = stateDict(state)
            
    return <WizardContext.Provider value={state}>
        <expandedContext.Provider value={{expanded: expanded, setExpanded: setExpanded}}>
        <Typography> hello, {user?.given_name} | {user?.locale} </Typography>
        
        {/* <Button onClick={() => {
            // setUserData({email: 'nash.idan@gmail.com', tier: 'editor', videos: [], savedAnswers: emptyState()}
            if (user?.email) {
                getUserData(user.email)

            }
        }} > TEST SET USER </Button> */}

        {userData && <StepContainer gap={2}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 5, gap: 5, alignItems: 'center', backgroundColor: colors.purple}} >
                <Typography paddingBottom={2} variant='h3' color={colors.white} > Creation Wizard </Typography>
                <Typography variant='h6' color={colors.white} > 
                    Make educational videos or stories for your children or pupils with only a few clicks! 
                </Typography>
            </div>

            <Challenge onChange={challenge => setState({...state, challenge: challenge})} />
            <ContextQuestions onSubmit={ctx => setState({...state, context: ctx})} />
            <EducationalMethods onSubmit={methods => setState({...state, educationalMethods: methods})} />
            <ConfigOutput onChange={config => setState({...state, outputConfig: config})} />
            {userData.tier === 'editor' && <PromptBuilder />}
            <AddButton disabled={currentStep !== AppStep.context} onClick={() => setCurrentStep(AppStep.review)} > 
                <Typography variant='h5'>
                Generate Script 
            </Typography>
            </AddButton>
        </StepContainer>}
        </expandedContext.Provider>

        <DBackdrop open={currentStep === AppStep.review} sx={{zIndex: 3}} onClick={() => {
            console.log('backdrop click', AppStep[currentStep])
            if (currentStep === AppStep.review) {
                setCurrentStep(AppStep.context)
            }
        }} >
            <StepContainer p={2} gap={3} height={400} overflow='scroll'>

                <Typography variant='subtitle2'>please review your stuff</Typography>
                <Typography variant='subtitle1' style={{maxHeight: 500, whiteSpace: 'break-spaces', overflowY: 'scroll'}}> 
                    {Object.keys(w2d).map(k => <Typography key={k}>{k}: {w2d[k]}</Typography> )}
                </Typography>
                <NavButton
                    disabled={(currentStep !== AppStep.review) || (userData?.tier === 'guest')} 
                    onClick={() => {
                        console.log('btton click')
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
            <NavButton disabled onClick={() => {
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
            <NavButton onClick={() => {
                onExit()
                window.scrollTo(0, 0)
            }} > 
                exit 
            </NavButton>
            <NavButton onClick={() => {
                setState(emptyState())
                setCurrentStep(AppStep.context)
                window.scrollTo(0, 0)
            }} > 
                restart 
            </NavButton>
        </Stack>

    </WizardContext.Provider>
}

export default Wizard
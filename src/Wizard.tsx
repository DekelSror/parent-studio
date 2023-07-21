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
import { useAuth0 } from '@auth0/auth0-react'
import { UserDataContext, canAccess } from './users'
import { setUserData } from './users'
import { useMetrics } from './metrics'

enum WizardStep {context, output, review, finalize}

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
    const metrics = useMetrics('wizard')

    const [state, setState] = useState<WizardState>(userData.savedAnswers)
    const [currentStep, setCurrentStep] = useState(WizardStep.context)    
    const [expanded, setExpanded] = useState<string>()
    const isStreaming = useRef(false)
    const progressInterval = useRef<NodeJS.Timer>()

    const generateScript = () => {
        isStreaming.current = true

        backend.streamScript(state, delta => {                    
            if (delta.isDone) {
                state.prompt = backend.scriptPrompt(state)
                isStreaming.current = false
            }
            
            setState({...state, script: delta.content})
        })
    }

    const generateVideo = async() => {
        const videoId = await backend.generateVideo(state)
        
        if (videoId) {
            setUserData({...userData, videos: [...userData.videos, videoId]})
            
            progressInterval.current = setInterval(async() => {
                    
                const statusOrUrl = await backend.videoProgress(videoId)
                
                if (statusOrUrl.startsWith('http')) {
                    setState({...state, outputUrl: statusOrUrl})
                    clearInterval(progressInterval.current)
                    onSubmit(state)
                }
            }, 3000)
        }
    }

    const w2d = stateDict(state)
            
    return <WizardContext.Provider value={state}>

        <Typography> hello, {user?.given_name} | {user?.locale} | {userData.tier} </Typography>
    

        <StepContainer gap={2} style={{
            pointerEvents: currentStep === WizardStep.context ? 'auto' : 'none',
            backgroundColor: currentStep === WizardStep.context ? colors.white : colors.grey
        }}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 5, gap: 5, alignItems: 'center', backgroundColor: colors.purple}} >
                <Typography paddingBottom={2} variant='h3' color={colors.white} > Creation Wizard </Typography>
                <Typography variant='h6' color={colors.white} > 
                    Make educational videos or stories for your children or pupils with only a few clicks! 
                </Typography>
            </div>
        <expandedContext.Provider value={{expanded: expanded, setExpanded: setExpanded}}>

            <Challenge onChange={challenge => setState({...state, challenge: challenge})} />
            <ContextQuestions onSubmit={ctx => setState({...state, context: ctx})} />
            <EducationalMethods onSubmit={methods => setState({...state, educationalMethods: methods})} />
            <ConfigOutput onChange={config => setState({...state, outputConfig: config})} />
            <Stack alignItems='center'>
            {/* this ^ Stack is just to center the button */}
                <AddButton disabled={currentStep !== WizardStep.context} onClick={() => setCurrentStep(WizardStep.review)} > 
                    <Typography variant='h5'>
                        Generate Script 
                    </Typography>
                </AddButton>
            </Stack>
        </expandedContext.Provider>
        </StepContainer>

        <DBackdrop open={currentStep === WizardStep.review} sx={{zIndex: 3}} onClick={e => {
            // this is just...
            if ((e.target as HTMLElement).className.startsWith('MuiBackdrop')) {
                setCurrentStep(WizardStep.context)
            }
        }} >
            <StepContainer p={2} gap={3} height={400} overflow='scroll'>

                <Typography variant='h4'>please review your stuff</Typography>
                <Typography variant='subtitle1' style={{maxHeight: 500, whiteSpace: 'break-spaces', overflowY: 'scroll'}}> 
                    {Object.keys(w2d).map(k => <Typography key={k}>{k}: {w2d[k]}</Typography> )}
                </Typography>
                <NavButton
                    disabled={!canAccess('wizard:use', userData)} 
                    onClick={() => {
                        setUserData({...userData, savedAnswers: state})
                        generateScript()
                        setCurrentStep(WizardStep.output)
                    }} 
                >
                    {canAccess('wizard:use', userData) ? 'Go!' : 'Please register with us to start generating'}
                </NavButton>
            </StepContainer>
        </DBackdrop>

        {currentStep === WizardStep.output && <StepContainer >
            <EditScript onChange={script => setState({...state, script: script})} active={isStreaming.current} />
            <ConfigAvatar />
            <NavButton onClick={() => {
                generateVideo()
                setCurrentStep(WizardStep.finalize)
                metrics('generate script')
            }} >
                Generate Video
            </NavButton>
        </StepContainer>}

        {currentStep === WizardStep.finalize && <StepContainer>
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
                setCurrentStep(WizardStep.context)
                window.scrollTo(0, 0)
            }} > 
                restart 
            </NavButton>
        </Stack>

    </WizardContext.Provider>
}

export default Wizard
import React, { createContext, useContext, useRef, useState } from 'react'
import { NavButton, StepContainer } from './styles'
import { Backdrop, Stack, Typography, styled } from '@mui/material'
import Challenge from './stepComponents/Challenge'
import ConfigAvatar from './stepComponents/ConfigAvatar'
import ConfigOutput from './stepComponents/ConfigOutput'
import ContextQuestions from './stepComponents/ContextQuestions'
import EditScript from './stepComponents/EditScript'
import EducationalMethods from './stepComponents/EducationalMethods'
import Finalize from './stepComponents/Finalize'
import { WizardState, WizardContext, testState } from './store'
import useBackend from './Backend'
import { userContext } from './App'
import PromptBuilder from './PromptBuilder'

enum AppStep {context, output, review, finalize}

export const expandedContext = createContext<{expanded: string | undefined, setExpanded: (val: string | undefined) => void}>(
    {expanded: undefined, setExpanded: val => {}}
)

const DBackdrop = styled(Backdrop)(({theme}) => ({
    backdropFilter: 'blur(3px)',
}))

const Wizard = ({onSubmit, onExit}: {onSubmit: (stt: WizardState) => void, onExit: () => void}) => {
    const [state, setState] = useState<WizardState>(testState())
    const backend = useBackend()
    const [expanded, setExpanded] = useState<string>()
    const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.context)
    const user = useContext(userContext)
    

    // should be part of some store...
    const [videoId, setVideoId] = useState<string>()

    const progressInterval = useRef<NodeJS.Timer>()

    const generateScript = () => {
        backend.streamScript(state, delta => {
                    
            const lastFinishReason = delta[delta.length - 1].choices[0].finish_reason
            const lastContent = delta[delta.length - 1].choices[0].delta.content
            if (lastFinishReason === 'stop' || (!lastContent)) {
                state.prompt = backend.scriptPrompt(state)  
                setCurrentStep(AppStep.output)
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
        const videoId = await backend.generateVideo(state)
        setVideoId(videoId) // save somehow for future use

        progressInterval.current = setInterval(async() => {
            if (videoId) {
                
            }
            const statusOrUrl = await backend.videoProgress(videoId!)

            if (statusOrUrl.startsWith('http')) {
                setState({...state, outputUrl: statusOrUrl})
                clearInterval(progressInterval.current)
                onSubmit(state)
            }
        }, 3000)
    }

    return <WizardContext.Provider value={state}>
        <expandedContext.Provider value={{expanded: expanded, setExpanded: setExpanded}}>
        <StepContainer gap={2}>
            <Typography variant='h3' > Context </Typography>
            <Challenge onChange={challenge => setState({...state, challenge: challenge})} />
            <ContextQuestions onSubmit={ctx => setState({...state, context: ctx})} />
            <EducationalMethods onSubmit={methods => setState({...state, educationalMethods: methods})} />
            <ConfigOutput onChange={config => setState({...state, outputConfig: config})} />
            {user.role === 'editor' && <PromptBuilder />}
            <NavButton disabled={currentStep !== AppStep.context} onClick={() => setCurrentStep(AppStep.review)} > Generate Script </NavButton>
        </StepContainer>
        </expandedContext.Provider>

        <DBackdrop open={currentStep === AppStep.review} onClick={() => setCurrentStep(AppStep.context)} sx={{zIndex: 3}} >
            <StepContainer p={2} gap={3} height={400} overflow='scroll'>

                <Typography variant='subtitle2'>please review your stuff</Typography>
                <Typography variant='subtitle1' style={{maxHeight: 270, whiteSpace: 'break-spaces', overflowY: 'scroll'}}> 
                    {JSON.stringify(state, null, 4)}  
                </Typography>
                <NavButton disabled={(currentStep !== AppStep.review) || user.role === 'guest'} onClick={() => {
                    generateScript()
                    setCurrentStep(AppStep.output)
                }} > 
                    {user.role === 'guest' ? 'Please register with us to start generating' : 'Go!'}
                </NavButton>
            </StepContainer>
        </DBackdrop>

        {currentStep === AppStep.output && <StepContainer >
            <EditScript onChange={script => setState({...state, script: script})} />
            <ConfigAvatar />
            <NavButton disabled={user.role === 'guest'} onClick={() => {
                generateVideo()
                setCurrentStep(AppStep.finalize)
            }} >
                Generate Video
            </NavButton>
        </StepContainer>}

        {currentStep === AppStep.finalize && <StepContainer>
            <Finalize />
        </StepContainer>}

        <Stack direction='row' gap={4} justifyContent='space-around' >
            <NavButton onClick={onExit} > exit </NavButton>
        </Stack>

    </WizardContext.Provider>
}

export default Wizard
import { WizardState } from "./store";
import { OpenAiCompletionProvider, DidVideoProvider, IndexedDBAccessor } from "./apis/providers";

export type ChatStreamEntry = {
    choices: {
        delta: {role: string, content?: string}
        finish_reason?: string
        index: number
    }[]
    created: Date
    id: string
    model: string
    object: string
}

class Backend {
    promptsDB = new IndexedDBAccessor()
    videoProvider = new DidVideoProvider()
    completionProvider = new OpenAiCompletionProvider()


    scriptPrompt = (state: WizardState) => {
        const prompt = "as an education expert of the following educational method: \n" + 
            state.educationalMethods[0] +
            " - please write a short " + 
            state.outputConfig.deliveryStyle + 
            " monologue for a " +
            " video for a " +
            state.context.targetChildAge +
            " years old child." + 
            "\nIt should be enough for a " + 
            state.outputConfig.videoLength + 
            " seconds long video." + 
            '\nThe challenge the child is facing is: ' +
            state.challenge +
            ".\nFor context, their favorite activities are: " +
            state.context.favoriteActivities.join(', ') +
            '.\nTheir disliked activities are: ' +
            state.context.dislikedActivities.join(', ')
        
        return prompt
    }

    generateVideo = async(state: WizardState) => {
        const driver = (await this.videoProvider.getDrivers(state.outputConfig.presenterId))[0]
        console.log('going to generate video with', state.outputConfig.presenterId, driver)
        return this.videoProvider.generateVideo(state.script, driver.presenter_id, driver.driver_id)
    }

    videoProgress = (id: string) => {
        return this.videoProvider.videoProgress(id)
    }

    getPrompts = (email: string) => this.promptsDB.getPrompts(email)

    savePrompt = (prompt: string, email: string) => {
        this.promptsDB.savePrompt(prompt, email)
    }

    getPresenters = () => this.videoProvider.getPresenters!()

    streamScript = (state: WizardState, onDelta: (delta: {content: string, isDone: boolean}) => void) => {
        this.completionProvider.streamCompletion(this.scriptPrompt(state), onDelta)
    }
}


const backend = new Backend()

const useBackend = () => {
    return backend
}

export default useBackend
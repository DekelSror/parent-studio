import { Configuration, OpenAIApi } from "openai";
import { WizardState } from "./store";

type ChatStreamEntry = {
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

interface DbAccessor {
    getPrompts: (email: string) => string[]
    savePrompt: (prompt: string, email: string) => void
}

class IndexedDBAccessor implements DbAccessor {
    db?: IDBDatabase
    
    constructor() {
        const dbReq = indexedDB.open('parental-aid', 1)

        dbReq.onsuccess = () => {
            this.db = dbReq.result 
        }
        
        dbReq.onupgradeneeded = () => {
            if (!this.db) return

            const promptsStore = this.db.createObjectStore('prompts', {autoIncrement: true, keyPath: 'prompt'})
            promptsStore.createIndex('email', 'email', {unique: false})
        }

        dbReq.onerror = () => {
            // console.log('error opening db', dbReq.error?.message)
        }
    }

    getPrompts = (email: string) => {
        if (!this.db) return []
        const tr = this.db.transaction('prompts', 'readonly')

        let rv: string[] = []

        tr.oncomplete = () => {
            const res = tr.objectStore('prompts').index('email').getAll(email)

            if (res) {
                rv = res.result as string[]
            }
        }

        return rv
    }

    savePrompt = (prompt: string, email: string) => {
        if (!this.db) {
            return
        }


        return this.db
            .transaction('prompts', 'readwrite')
            .objectStore('prompts')
            .add({prompt: prompt, email: email, time: Date.now()})

    }
}

class Backend {
    openaiKey = import.meta.env.VITE_OPENAI_KEY
    dIdKey = import.meta.env.VITE_DID_KEY

    promptsDB: DbAccessor
    client = new OpenAIApi(new Configuration({
        apiKey: this.openaiKey
    }))

    
    
    constructor(db: DbAccessor) {
        this.promptsDB = db
    }


    dIdHeaders: HeadersInit = {
        accept: 'application/json',
        Authorization: 'Basic ' + this.dIdKey
    }
    

    generateVideo = async(state: WizardState) => {
        const response = await fetch('https://api.d-id.com/clips', {
            method: 'post',
            headers: {...this.dIdHeaders, 'content-type': 'application/json'},
            body: JSON.stringify({
                presenter_id: 'amy-jcwCkr1grs',
                driver_id: 'uM00QMwJ9x',
                script: {
                    type: 'text',
                    input: state.script.slice(0, 200)
                }
            })
        })

        if ([200, 201].includes(response.status)) {
            const body: {
                id: string,
                created_at: Date,
                status: string,
                object: string,
            }  = await response.json()
            
            return body.id
        }

    }
    
    videoProgress = async(id: string) => {
        const response = await fetch('https://api.d-id.com/clips/' + id, {
            method: 'get',
            headers: this.dIdHeaders
        })
        
        const body = await response.json()

        const [result_url, status] = [body.result_url as string, body.status as string]

        if (status === 'done') return result_url
        return status
    }
    
    handleChatStream = (e: ProgressEvent) => {
        const target = e.currentTarget as XMLHttpRequest
    
        const deltasRaw = target.responseText.split('\n\n')

        const deltas = deltasRaw.filter(d => d !== '' && d !== 'data: [DONE]')
            .map(d => d.trim().split('data: ')[1])
            .map<ChatStreamEntry>(d => JSON.parse(d))
    
        return deltas
    }

    streamCompletion = (content: string, onDelta: (delta: ChatStreamEntry[]) => void) => {
        this.client.createChatCompletion(
            {
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user', 
                    content: content,
                }],
                max_tokens: 200,
                stream: true
            }, 
            { onDownloadProgress: e => onDelta(this.handleChatStream(e))}
        )
    }

    getCompletion = async(content: string) => {
        try {
            const response = await this.client.createChatCompletion(
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: content
                    }]
                }
            )
            
            if (response.status === 200) {
                return response.data.choices[0].message?.content
            } else {
                // console.log('get completion status is', response.status, response.statusText)
            }
        } catch (error) {
            
        }
    }


    contextVerification = async(state: WizardState) => {
        const prompt = "hi. can you review this list of a child's favorite activities and rule out the ones that aren't suitable or make no sense? \n" +
            state.context.favoriteActivities.map((fa, i) => i + '. ' + fa).join('\n') + 
            '\n please output a JSON object where the keys are the description of activity and the value is the reason it is not sensible as a favorite activity for a child.\n' +
            'please only include in the object the activities that you rule out'
        
        const response = await this.getCompletion(prompt)

        if (response) {
            try {
                return JSON.parse(response) as {[k: string]: string}
            } catch (error) {
                return undefined
            }
        } else {
            // console.log('BE did not receive response for propmt ' + prompt)
        }
    }

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


    savePrompt = (prompt: string, email: string) => {
        this.promptsDB.savePrompt(prompt, email)
    }

    generateScript = async(state: WizardState) => {
        const prompt = this.scriptPrompt(state)
        return await this.getCompletion(prompt)
    }

    streamScript = (state: WizardState, onDelta: (delta: ChatStreamEntry[]) => void) => {
        this.streamCompletion(this.scriptPrompt(state), onDelta)
    }
}

const backend = new Backend(new IndexedDBAccessor())


const useBackend = () => {
    // useEffect(() => {
    // sign in, set up push, permissions etc
    // return () => sign out etc
    
    // }, [])

    return backend
}



export default useBackend
import { Configuration, OpenAIApi } from "openai"
import { ChatStreamEntry } from "../Backend"


export interface VideoProvider<P, D> {
    generateVideo: (script: string, presenterId: string, driverId: string) => Promise<string | undefined>
    /**
     * @returns 
     * if not ready, returns generation status (i.e started, inProgress, failed)
     * when ready, returns the generated video's url
     */
    videoProgress: (id: string) => Promise<string>
    getPresenters: () => Promise<P[]>
    getDrivers: (presentedId: string) => Promise<D[]>
}


export interface CompletionProvider {
    streamCompletion: (input: string, onDelta: (delta: {content: string, isDone: boolean}) => void) => void
}


export interface DbAccessor {
    getPrompts: (email: string) => string[]
    savePrompt: (prompt: string, email: string) => void
}

type DidPresenter = {
    id: string,
    created_at: Date,
    status: string,
    object: string,
}

type DidDriver = {
    presenter_id: string,
    driver_id: string,
    driver_type: string,
    gender: string,
    created_at: Date,
    modified_at: Date,
    driver_image_url: string,
    thumbnail_url: string,
    video_url: string,
    preview_url: string
}

export class DidVideoProvider implements VideoProvider<DidPresenter, DidDriver> {
    dIdKey = import.meta.env.VITE_DID_KEY

    dIdHeaders: HeadersInit = {
        Accept: 'application/json',
        Authorization: 'Basic ' + this.dIdKey,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    }


    generateVideo = async(script: string, presenterId: string, driverId: string) => {
        const response = await fetch('https://api.d-id.com/clips', {
            method: 'post',
            headers: {...this.dIdHeaders},
            body: JSON.stringify({
                presenter_id: presenterId,
                driver_id: driverId,
                script: {
                    type: 'text',
                    input: script.slice(0, Math.min(200, script.length))
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

    getPresenters = async() => {
        const response = await fetch('https://api.d-id.com/clips/actors?limit=100', {
            method: 'get',
            headers: this.dIdHeaders
        })

        const rv = (await response.json()).actors

        console.log('presenters', rv)

        return rv
    }

    getDrivers = async(presenterId: string) => {
        const response = await fetch('https://api.d-id.com/clips/actors/' + presenterId + '/drivers',{
            method: 'get',
            headers: {...this.dIdHeaders, 'Content-Type': 'application/json'}
        })

        return (await response.json()).clips_drivers as {
            presenter_id: string,
            driver_id: string,
            driver_type: string,
            gender: string,
            created_at: Date,
            modified_at: Date,
            driver_image_url: string,
            thumbnail_url: string,
            video_url: string,
            preview_url: string
        }[] 
    }
}

export class OpenAiCompletionProvider implements CompletionProvider {
    openaiKey = import.meta.env.VITE_OPENAI_KEY

    client = new OpenAIApi(new Configuration({
        apiKey: this.openaiKey,
    }))

    handleChatStream = (e: ProgressEvent) => {
        const target = e.currentTarget as XMLHttpRequest
    
        const deltasRaw = target.responseText.split('\n\n')

        const deltas = deltasRaw.filter(d => d !== '' && d !== 'data: [DONE]')
            .map(d => d.trim().split('data: ')[1])
            .map<ChatStreamEntry>(d => JSON.parse(d))
    
        const parsed = deltas.reduce((s, d) => {
            if (d.choices[0].delta.content) {
                s += d.choices[0].delta.content
            }

            return s
        }, '')

        const lastFinishReason = deltas[deltas.length - 1].choices[0].finish_reason
        const lastContent = deltas[deltas.length - 1].choices[0].delta.content
        
        return {content: parsed, isDone: lastFinishReason === 'stop' || (!lastContent)}
    }

    streamCompletion = (content: string, onDelta: (delta: {content: string, isDone: boolean}) => void) => {
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
}

export class IndexedDBAccessor implements DbAccessor {
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

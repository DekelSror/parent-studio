import { WizardState } from "./store"

export type UserData = {
    email: string
    tier: 'guest' | 'regular' | 'editor',
    videos: string[],
    savedAnswers?: WizardState
}

const url = import.meta.env.VITE_KV_REST_API_URL
const token = import.meta.env.VITE_KV_REST_API_TOKEN
const tokenReadonly = import.meta.env.VITE_KV_REST_API_TOKEN_READONLY

export const getUserData = async(email: string) => {
    
    const res = await fetch(url + '/get/' + email, {
        method: 'get',
        headers: {
            Authorization: 'Bearer ' + tokenReadonly
        }
    })

    return JSON.parse((await res.json()).result) as UserData | undefined
}

export const setUserData = async(userData: UserData) => {
    const res = await fetch(url + '/set/' + userData.email, {
        method: 'post',
        headers: {
            Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(userData)
    })

    return (await res.json() as {result: string}).result
}



import { WizardState } from "./store"

export type UserData = {
    email: string
    tier: 'guest' | 'regular' | 'editor',
    videos: string[],
    savedAnswers?: WizardState
}

export const getUserData = async(email: string) => {
    const res = await fetch(import.meta.env.VITE_KV_REST_API_URL + '/get/' + email, {
        method: 'get',
        headers: {
            Authorization: 'Bearer ' + import.meta.env.VITE_KV_REST_API_TOKEN_READONLY
        }
    })
    
    return (await res.json() as {result: UserData | undefined}).result
}

export const setUserData = async(userData: UserData) => {
    const res = await fetch(import.meta.env.VITE_KV_REST_API_URL + '/set/' + userData.email, {
        method: 'post',
        headers: {
            Authorization: 'Bearer ' + import.meta.env.VITE_KV_REST_API_TOKEN
        },
        body: JSON.stringify(userData)
    })

    return (await res.json() as {result: string}).result
}



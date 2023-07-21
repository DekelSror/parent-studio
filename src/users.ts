import { createContext } from "react"
import { WizardState, emptyState } from "./store"

export type UserData = {
    email: string
    tier: 'guest' | 'regular' | 'editor',
    videos: string[],
    savedAnswers: WizardState
}

export const johnDoeUserData: () => UserData = () => ({
    email: 'n/a',
    tier: 'guest',
    videos: [],
    savedAnswers: emptyState()
})

const url = import.meta.env.VITE_KV_REST_API_URL
const token = import.meta.env.VITE_KV_REST_API_TOKEN
const tokenReadonly = import.meta.env.VITE_KV_REST_API_TOKEN_READONLY

export const getUserData = async(email: string) => {
    if (email === 'n/a') return undefined
    
    const res = await fetch(url + '/get/' + email, {
        method: 'get',
        headers: {
            Authorization: 'Bearer ' + tokenReadonly
        }
    })

    return JSON.parse((await res.json()).result) as UserData | undefined
}

export const setUserData = async(userData: UserData) => {
    if (!userData || !(userData.email)) {
        console.log('what theactual')
        // return
    }

    const res = await fetch(url + '/set/' + userData.email, {
        method: 'post',
        headers: {
            Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(userData)
    })

    return (await res.json() as {result: string}).result
}

export const UserDataContext = createContext<UserData>(johnDoeUserData())

const rolesAndPermissions = {
    guest: ['wizard:view', 'user:signup-self'],
    regular: ['wizard:use', 'user:login-self', 'user:signout-self'],
    editor: ['editor:view', 'editor:use', 'user:modify']
}


const getPermissions = (tier: 'guest' | 'regular' | 'editor') => {
    let permissions: string[] = rolesAndPermissions.guest
    if (tier === 'guest') return permissions

    permissions = [...permissions, ...rolesAndPermissions.regular]
    if (tier === 'regular') return permissions

    return [...permissions, ...rolesAndPermissions.editor]
}

export const canAccess = (feature: string, userData: UserData) => {
    return getPermissions(userData.tier).includes(feature)
}

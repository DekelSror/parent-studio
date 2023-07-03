import { createContext } from "react"


export const answers = {
    favoriteActivities: ['reading', 'playing pretend', 'sports', 'dolls', 'dance'],
    dislikedActivities: ['chores', 'school', 'shower', 'go to bed'],
    challenge: ['making new friends', 'bad dreams', 'only wants candy'],
    educationalMethods: ['Montessori', 'Waldorf', 'Reggio Emilia', 'Constructivism', 'Traditional'],
    deliveryStyle: ['educational', 'counsel', 'story']
}

export type FamilyContext = {
    targetChildAge: number
    siblings: number[],
    liveTogether: boolean
    gradeAtSchool?: number
    favoriteActivities: string[]
    dislikedActivities: string[]
}

export const zeroCtx: () => FamilyContext = () => ({
    targetChildAge: 0,
    siblings: [],
    liveTogether: true,
    favoriteActivities: [],
    dislikedActivities: []
})

export type WizardState = {
    context: FamilyContext
    challenge: string
    educationalMethods: string[]
    prompt: string
    script: string
    outputConfig: {
        videoLength: number
        deliveryStyle: 'educational' | 'counsel' | 'story',
    }
    avatarConfig: {
        gender: 'f' | 'm'
    }
    outputUrl?: string
}

export const stateDict: (stt: WizardState) => {[k: string]: string} = stt => ({
    'age': stt.context.targetChildAge.toString(),
    'favorite activities': stt.context.favoriteActivities.join(', '),
    'disliked activities': stt.context.dislikedActivities.join(', '),
    'challenge': stt.challenge,
    'methods': stt.educationalMethods.join(', '),
    'delivery style': stt.outputConfig.deliveryStyle,
    'siblings number': stt.context.siblings.length.toString(),
    'siblings ages': stt.context.siblings.reduce((s, n) => s + (n.toString()) + ', ', '')
})

export const emptyState: () => WizardState = () => ({
    context: zeroCtx(),
    challenge: '',
    educationalMethods: [],
    prompt: '',
    script: '',
    outputConfig: {
        videoLength: 60,
        deliveryStyle: 'educational',
    },
    avatarConfig: {
        gender: 'f'
    },
    outputUrl: undefined
})

export const WizardContext = createContext<WizardState>(emptyState())


export const testState: () => WizardState = () => ({
    context: {
        targetChildAge: 8,
        siblings: [4, 15],
        favoriteActivities: ['reading', 'playing pretend'],
        dislikedActivities: ['chores', 'school'],
        liveTogether: true,
        gradeAtSchool: 3
    },
    challenge: 'making new friends',
    educationalMethods: ['traditional'],
    prompt: 'give me the first two lines of the Fresh Prince of Bel-Air opening rap',
    script: "This is where we will write the script for your video!",
    outputConfig: {
        videoLength: 60,
        deliveryStyle: 'educational',
    },
    avatarConfig: {
        gender: 'f'
    },
    outputUrl: undefined
})

export const testState2 = () => ({
    context: {
        targetChildAge: 50,
        siblings: [-4, 152],
        favoriteActivities: ['testing databases', 'testing auth services'],
        dislikedActivities: ['devOps', 'containers'],
        liveTogether: true,
        gradeAtSchool: 37
    },
    challenge: 'hosting an app',
    educationalMethods: ['burgerbacon'],
    prompt: "Have you ever had a dream where you wanted someone to do you so much you could do anything?",
    script: "This is where we will write the script for your video!",
    outputConfig: {
        videoLength: 60,
        deliveryStyle: 'educational',
    },
    avatarConfig: {
        gender: 'f'
    },
    outputUrl: undefined
})
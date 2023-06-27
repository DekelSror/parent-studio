import English from './texts/en.json'


let appLanguage = 'en'

type Texts = {[k: string]: string | Texts}

const langCache: {[lang: string]: Texts} = {
    'en': English
}

export const changeLanguage = (language: string) => {
    if (Object.keys(langCache).includes(language)) {
        appLanguage = language
    }
}

export const globz = (key: string) => {
    const parts = key.split('.')
    // console.log(key, parts, appLanguage, langCache)
    let res: Texts = langCache[appLanguage]
    for (const part of parts) {
        if (!(res && res[part])) break

        if (typeof(res[part]) === 'string') {
            return res[part] as string
        }
        res = res[part] as Texts
    }

    return 'key ' + key + ' not found!'
}

export const setLanguage = (language: string) => appLanguage = language
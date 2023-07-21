import mixpanel from "mixpanel-browser";
import { useContext, useEffect } from "react";
import { UserDataContext } from "./users";

class Metrics {
    constructor() {
        mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN || '')
    }

    send(eventType: string, content?: Record<string, any>) {
        mixpanel.track(eventType, content)
    }
}

const metrics = new Metrics()

export const useMetrics = (pageName: string) => {
    const userData = useContext(UserDataContext)

    useEffect(() => {
        if (userData.tier != 'guest') {
            metrics.send('page visited', {page: pageName, ...userData})
            return () => metrics.send('page exited', {page: pageName, ...userData})
        }

    }, [userData])

    return (eventType: string, content?: Record<string, any>) => metrics.send(eventType, {page: pageName, ...userData, ...content})
}
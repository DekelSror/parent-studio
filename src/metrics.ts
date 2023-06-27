import mixpanel from "mixpanel-browser";
import { useEffect } from "react";

class Metrics {
    constructor() {
        mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN || '', { track_pageview: true })

        // idea - on init failure, return a new MockService that doesn't crash
        
    }

    send(eventType: string, content?: {[k: string]: string}) {
        mixpanel.track(eventType, content)
    }
}

const metrics = new Metrics()

export const useMetrics = () => {
    // we can useEffect to mixpanel.identify when a user signs in
    return metrics
}

export const usePlaceEvent = (name: string) => {
    useEffect(() => {
        mixpanel.track('place_visited', {place_name: name})
        return () => mixpanel.track('place_left', {place_name: name})
    }, [])

}
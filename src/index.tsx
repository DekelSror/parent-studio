import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { UserDataContext, getUserData, johnDoeUserData, setUserData } from './users';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

const AuthBoy = ({children}: {children?: JSX.Element}) => {
    const [udata, setUdata] = useState(johnDoeUserData())
    const {user, isAuthenticated, isLoading} = useAuth0()

    useMemo(() => {
        console.log('memo', user, udata)
        if (user?.email && udata.email === 'n/a') {
            getUserData(user.email).then(val => {
                if (val) {
                    setUdata(val)
                }
            })
        }
    }, [udata, user, isAuthenticated, isLoading])

    return <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{audience: '/', redirect_uri: window.location.origin}}
        cacheLocation='localstorage'
        useRefreshTokens
        onRedirectCallback={(_, user) => {
            if (user && user.email) {
                getUserData(user.email).then(userData => {
                if (userData) {// registered user
                    setUdata({...userData, email: user.email!})
                    setUserData({...userData, email: user.email!})
                }
                else { // new user
                    setUdata({...johnDoeUserData(), email: user.email!})
                    setUserData({...johnDoeUserData(), email: user.email!})
                }
            })
            }
        }}
    >
        <UserDataContext.Provider value={udata}>
            {children}
        </UserDataContext.Provider>
    </Auth0Provider>
}

root.render(
    <React.StrictMode>
        <AuthBoy>
            <App />
        </AuthBoy>
    </React.StrictMode>
)
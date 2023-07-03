import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const AuthBoy = ({children}: {children?: JSX.Element}) => {

  return <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{redirect_uri: window.location.origin}}
    cacheLocation='localstorage'
    useRefreshTokens
    // onRedirectCallback={(_, user) => {
    //   if (user) {
        
    //   }
    // }}
  >
    {children}
  </Auth0Provider>
}


root.render(
  <React.StrictMode>
    <AuthBoy>
      <App />
    </AuthBoy>

  </React.StrictMode>
)
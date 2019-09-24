import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import { IAuthAction, AuthActionBuilder, AuthActions } from 'ionic-appauth';

import { IonicAppAuth } from '../../utils/app-auth';
import { IUserInfo } from '../../models/user-info';

interface IAuthContextValues {
    appAuth: IonicAppAuth,
    isAuthenticated : boolean, 
    user?: IUserInfo,
    authAction : IAuthAction
}

interface IAuthContextProps {
  children: ReactNode;
}

export const AppAuthContext = createContext<IAuthContextValues>({
  isAuthenticated: false,
  authAction: AuthActionBuilder.Default(),
  appAuth: IonicAppAuth.buildInstance()
});

export const useAppAuth = () => useContext(AppAuthContext);

const AppAuthProvider : FC<IAuthContextProps> = ({ children } : IAuthContextProps) => {

  const success = (action : IAuthAction) => {
    console.log("success")
    console.log(JSON.stringify(action))
    setIsAuthenticated(true);
    setAuthAction(action);
  }

  const failure = (action : IAuthAction) => {
    console.log("failure")
    console.log(JSON.stringify(action))
    setIsAuthenticated(false);
    setAuthAction(action);
    setUser(undefined);
  }

  const [appAuth] = useState(IonicAppAuth.buildInstance(success,failure));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUserInfo>();
  const [authAction, setAuthAction] = useState(AuthActionBuilder.Default());

  const asycsc =  async () => appAuth.PageLoadAsync();

  

  return (
    (authAction.action !== AuthActions.Default) ?
        <AppAuthContext.Provider
          value={{
              appAuth,
              isAuthenticated,
              authAction,
              user
          }}
        >
          {children}
        </AppAuthContext.Provider>
        : <div>Awaiting Auth</div>
  );
  
};

export default AppAuthProvider;
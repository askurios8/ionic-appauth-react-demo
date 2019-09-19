import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { IAuthAction, AuthActionBuilder, AuthActions, NullIonicAuthObject, IIonicAuth } from 'ionic-appauth';

import { IonicAppAuth } from '../../utils/app-auth';
import { IUserInfo } from '../../models/user-info';

interface IAuthContextValues {
    appAuth: IIonicAuth,
    isAuthenticated : boolean, 
    user?: IUserInfo,
    authAction : IAuthAction
}

interface IAuthContextProps extends RouteComponentProps {
  children: ReactNode;
}

export const AppAuthContext = createContext<IAuthContextValues>({
  isAuthenticated: false,
  authAction: AuthActionBuilder.Default(),
  appAuth: NullIonicAuthObject
});

export const useAppAuth = () => useContext(AppAuthContext);

const AppAuthProvider = ({ children, history } : IAuthContextProps) => {

  const success = async (action : IAuthAction) => {
    setIsAuthenticated(true);
    setAuthAction(action);
    setUser(await appAuth.getUserInfo<IUserInfo>());
    if(action.action === AuthActions.SignInSuccess || action.action === AuthActions.AutoSignInSuccess){
      history.replace('/home');
    }
  }

  const failure = (action : IAuthAction) => {
    setIsAuthenticated(false);
    setAuthAction(action);
    setUser(undefined);
    history.replace('/landing');
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appAuth] = useState<IIonicAuth>(IonicAppAuth.getInstance(success, failure));
  const [user, setUser] = useState<IUserInfo>();
  const [authAction, setAuthAction] = useState(AuthActionBuilder.Default());

  return (
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
  );
  
};

export default withRouter(AppAuthProvider);
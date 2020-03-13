import React, {  useEffect } from 'react';
import { skipWhile, take } from 'rxjs/operators';

import { AuthService } from '../services/AuthService';
import { AuthActions, IAuthAction } from 'ionic-appauth';
import { RouteComponentProps } from 'react-router';



interface LoginRedirectPageProps extends RouteComponentProps {}

const LoginRedirect : React.FC<LoginRedirectPageProps> = (props: LoginRedirectPageProps) => {

    useEffect(() => {
        AuthService.Instance.AuthorizationCallBack(props.location.pathname +  props.location.search);
        AuthService.Instance.authObservable.pipe(skipWhile((action : IAuthAction) => action.action !== AuthActions.SignInSuccess && action.action !== AuthActions.SignInFailed), take(1))
                                    .subscribe((action) => {
                                      if(action.action === AuthActions.SignInSuccess){
                                        props.history.replace('home');
                                      }else{
                                        props.history.replace('landing');
                                      }
                                    });
      
    },[]);

    return (
        <p>Signing in...</p>
    ); 
};

export default LoginRedirect;

import React from 'react';

import { Auth } from '../services/AuthService';
import { AuthActions, AuthObserver } from 'ionic-appauth';
import { RouteComponentProps } from 'react-router';
import { useIonViewDidLeave, useIonViewDidEnter, IonPage } from '@ionic/react';



interface LoginRedirectPageProps extends RouteComponentProps {}

const LoginRedirect : React.FC<LoginRedirectPageProps> = (props: LoginRedirectPageProps) => {
    let observer: AuthObserver;
    
    useIonViewDidEnter(() => {
      Auth.Instance.handleCallback(window.location.origin + props.location.pathname +  props.location.search);
      observer = Auth.Instance.addActionListener((action) => {
        if(action.action === AuthActions.SignInSuccess){
          props.history.replace('home');
        }else{
          props.history.replace('landing');
        }
      });
    });

    useIonViewDidLeave(() => {
      Auth.Instance.removeActionObserver(observer);
    });

    return (
      <IonPage>
        <p>Signing in...</p>
      </IonPage>
    ); 
};

export default LoginRedirect;

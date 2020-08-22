import React from 'react';

import { Auth } from '../services/AuthService';
import { RouteComponentProps } from 'react-router';
import { AuthActions, AuthObserver } from 'ionic-appauth';
import { useIonViewWillEnter, useIonViewDidLeave, IonPage } from '@ionic/react';

interface EndRedirectPageProps extends RouteComponentProps {}

const EndRedirect : React.FC<EndRedirectPageProps> = (props: EndRedirectPageProps) => {

    let observer: AuthObserver;

    useIonViewWillEnter(() => {
        Auth.Instance.handleCallback(window.location.origin + props.location.pathname +  props.location.search);
        observer = Auth.Instance.addActionListener((action) => {
            if(action.action === AuthActions.SignOutSuccess ||
                action.action === AuthActions.SignInFailed){
                    props.history.replace('landing');
            }
        });
    });

    useIonViewDidLeave(() => {
        Auth.Instance.removeActionObserver(observer);
    });
    
    return (
        <IonPage>
            <p>Signing out...</p>
        </IonPage>
        
    ); 
};

export default EndRedirect;

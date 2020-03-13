import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonPage } from '@ionic/react';

import { ActionCard } from '../components';
import { AuthService } from '../services/AuthService';
import { AuthActions, AuthActionBuilder } from 'ionic-appauth';
import { RouteComponentProps } from 'react-router';

interface LandingPageProps extends RouteComponentProps {}

const Landing : React.FC<LandingPageProps> = (props: LandingPageProps) => {

    const [action, setAction] = useState(AuthActionBuilder.Default);

    useEffect(() => {
        const sub = AuthService.Instance.authObservable.subscribe((action) => {
            console.log(JSON.stringify(action))
            setAction(action)
            if(action.action === AuthActions.SignInSuccess){
              props.history.replace('home');
            }
          });

        return function cleanup() {
            sub.unsubscribe();
        };
      
    },[]);

    function handleSignIn(e : any) {
        e.preventDefault();
        AuthService.Instance.signIn();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Logged Out</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonButton onClick={handleSignIn}>Sign In</IonButton>
                <ActionCard action={action}></ActionCard>
            </IonContent>
        </IonPage>
    ); 
};

export default Landing;

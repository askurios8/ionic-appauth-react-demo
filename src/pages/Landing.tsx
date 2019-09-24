import React from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/react';

import { ActionCard, useAppAuth } from '../components';

const Landing : React.FunctionComponent = () => {

    const { authAction, appAuth } = useAppAuth(); 

    const signIn = (e : any) => {
      e.preventDefault();
      appAuth.signIn('');  
    }

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Logged Out</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonButton onClick={(e) => signIn(e)}>Sign In</IonButton>
                <ActionCard action={authAction}></ActionCard>
            </IonContent>
        </>
    ); 
};

export default Landing;

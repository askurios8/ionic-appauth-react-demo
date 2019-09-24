import React from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/react';

import { ActionCard, UserInfoCard, useAppAuth } from '../components'

const Home : React.FunctionComponent = () => {

  const { authAction, appAuth, user } = useAppAuth(); 

  const signOut = (e : any) => {
    e.preventDefault();
    appAuth.signOut();  
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Logged In</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton onClick={(e) => signOut(e)}>Sign Out</IonButton>
        <ActionCard action={authAction}></ActionCard>
        <UserInfoCard userInfo={user}></UserInfoCard> 
      </IonContent>
    </>
  ); 
};

export default Home;
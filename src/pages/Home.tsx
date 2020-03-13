import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonPage } from '@ionic/react';

import { ActionCard, UserInfoCard } from '../components';
import { AuthService } from '../services/AuthService';
import { AuthActions, AuthActionBuilder } from 'ionic-appauth';
import { RouteComponentProps } from 'react-router';
import { IUserInfo, DefaultUserInfo } from '../models/UserInfo';

interface HomePageProps extends RouteComponentProps {}

const Home : React.FC<HomePageProps> = (props: HomePageProps) => {

    const [action, setAction] = useState(AuthActionBuilder.Default);
    const [user, setUser] = useState(new DefaultUserInfo());

    useEffect(() => {
        const sub = AuthService.Instance.authObservable.subscribe((action) => {
            setAction(action)
            if(action.action === AuthActions.SignOutSuccess){
              props.history.push('landing');
            }
          });

        return function cleanup() {
            sub.unsubscribe();
        };
      
    });

    function handleSignOut(e : any) {
        e.preventDefault();
        AuthService.Instance.signOut();
    }

    function handleGetUserDetails(e : any) {
        e.preventDefault();
        AuthService.Instance.getUserInfo<IUserInfo>().then(setUser);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Logged In</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonButton onClick={handleGetUserDetails}>Get User Details</IonButton>
                <IonButton onClick={handleSignOut}>Sign Out</IonButton>
                <ActionCard action={action}></ActionCard>
                {user.display_name !== "" && <UserInfoCard user={user}></UserInfoCard>}       
            </IonContent>
        </IonPage>
    ); 
};

export default Home;

import React from 'react';
import { IonCard, IonCardHeader, IonCardContent } from '@ionic/react';

import { IUserInfo } from '../../models/user-info';

interface IUserInfoProps {
    userInfo?: IUserInfo;
}

export const UserInfoCard = (props : IUserInfoProps) => {
    if (!props.userInfo) {
      return null;
    }

    return (
        <IonCard>
            <IonCardHeader>User Info</IonCardHeader>
            <IonCardContent>
                {JSON.stringify(props.userInfo)}
            </IonCardContent>
        </IonCard>
    );
}

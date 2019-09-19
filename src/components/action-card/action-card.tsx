import React from 'react';
import { IonCard, IonCardHeader, IonCardContent } from '@ionic/react';
//import { IAuthAction } from 'ionic-appauth';

interface IActionProps {
    action: any;
}

export const ActionCard = (props : IActionProps) => {
    if (!props.action) {
      return null;
    }

    return (
        <IonCard>
            <IonCardHeader>Action Data</IonCardHeader>
            <IonCardContent>
                {JSON.stringify(props.action)}
            </IonCardContent>
        </IonCard>
    );
}
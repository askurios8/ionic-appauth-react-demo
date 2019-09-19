import React from 'react';

import { useAppAuth } from '../../components';

const AuthCallback : React.FunctionComponent = () => {
    const { appAuth } = useAppAuth(); 
    appAuth.AuthorizationCallBack(window.location.href);
    return (<p>Signing In...</p>);
}

export default AuthCallback;
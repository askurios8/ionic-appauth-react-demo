import React from 'react';

import { useAppAuth } from '../../components';

const EndSession : React.FunctionComponent = () => {
    const { appAuth } = useAppAuth(); 
    appAuth.EndSessionCallBack();
    return (<p>Signing Out...</p>);
}

export default EndSession;
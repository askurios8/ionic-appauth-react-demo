import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAppAuth } from '..';

export const PrivateRoute = ({component , ...rest} : any) => {

    const { isAuthenticated } = useAppAuth();     
    
    const routeComponent = (props: any) => (
        (isAuthenticated)
            ? React.createElement(component, props)
            : <Redirect to={{pathname: '/landing'}}/>
    );
    return <Route {...rest} render={routeComponent}/>;
}






//     const { appAuth } = useAppAuth(); 
//     const [authComplete, setAuthComplete] = useState(false);

//     appAuth.startUpAsync().then(() => setAuthComplete(true));

//     const renderFn = (Component?: RouteComponent) => {
//         return (props: RouteProps) => {
//             if (!Component) {
//                 return null;
//             }
//             return <React.Component {...props} />;
//         };
//     };

//     return ((authComplete) ? <Route {...rest} render={renderFn(component)} /> : <div>No Auth</div>)
// }